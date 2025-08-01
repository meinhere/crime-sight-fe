from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
from supabase import create_client
from datetime import datetime
import os
from dotenv import load_dotenv
load_dotenv()  # take environment variables

app = FastAPI()

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Connection
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

class CrimeClusterResponse(BaseModel):
    name: str
    count: int
    level: str
    normalized_count: float

class MetaResponse(BaseModel):
    total_records: int
    filters: dict

class APIResponse(BaseModel):
    meta: MetaResponse
    data: list[CrimeClusterResponse]

@app.get("/api/crime-clusters", response_model=APIResponse)
async def get_crime_clusters(
    jenis_kejahatan: Optional[str] = Query(None),
    tahun: Optional[int] = Query(None),
    provinsi: Optional[str] = Query(None)
):
    try:
        # 1. Build query
        query = supabase.table('putusan').select('id, jenis_kejahatan, tahun, kabupaten(nama_kabupaten, kode_provinsi)')
        
        if jenis_kejahatan:
            query = query.eq('jenis_kejahatan', jenis_kejahatan)
        if tahun:
            query = query.eq('tahun', tahun)
        if provinsi:
            query = query.eq('kabupaten.kode_provinsi', provinsi)

        # 2. Execute query
        res = query.execute()
        # print(f"Raw query result: {res.data if res.data else 'No data'}")  # Debug: show first 2 items
        
        data = [item for item in res.data if item and isinstance(item, dict) and item.get('kabupaten') is not None]
        # print(f"Filtered data count: {len(data)}")
        # if data:
        #     print(f"Sample filtered item: {data[0]}")
        
        if not data:
            raise HTTPException(status_code=404, message="Data tidak ditemukan")

        # 3. Process data
        group_col = 'kabupaten.nama_kabupaten' if provinsi else 'kabupaten.kode_provinsi'
        # print(f"Group column: {group_col}")
        grouped_data = group_and_count(data, group_col)
        # print(f"Grouped data: {grouped_data}")
        clustered_data = perform_clustering(grouped_data)

        # 4. Prepare response
        response = {
            "data": clustered_data,
            "meta": {
                "total_records": len(data),
                "filters": {
                    "jenis_kejahatan": jenis_kejahatan,
                    "tahun": tahun,
                    "provinsi": provinsi
                }
            }
        }

        return response

    except Exception as e:
        raise HTTPException(status_code=500, error=str(e))

def group_and_count(data: list, group_key: str) -> list[dict]:
    """Group data and count occurrences"""
    counts = {}
    
    for item in data:
        key = get_nested_value(item, group_key)
        if key is not None:  # Only count non-None keys
            counts[key] = counts.get(key, 0) + 1
    
    return [{"name": k, "count": v} for k, v in counts.items() if k is not None]

def get_nested_value(obj: dict, path: str):
    """Access nested dictionary keys"""
    keys = path.split('.')
    # print(f"Getting nested value for path: {path}, keys: {keys}")
    # print(f"Initial obj: {obj}")
    
    for i, key in enumerate(keys):
        # print(f"Step {i}: key='{key}', obj type: {type(obj)}, obj: {obj}")
        if obj is None or not isinstance(obj, dict):
            # print(f"Returning None at step {i} because obj is None or not dict")
            return None
        obj = obj.get(key, {})
        # print(f"After get('{key}'): {obj}")
    
    result = obj if obj != {} else None
    # print(f"Final result: {result}")
    return result

def perform_clustering(data: list[dict]) -> list[dict]:
    """Perform KMeans clustering on crime data"""
    if not data:
        return []

    # Prepare data for clustering
    counts = [d['count'] for d in data]
    scaler = MinMaxScaler()
    normalized_counts = scaler.fit_transform([[x] for x in counts])
    
    # Cluster into 3 levels
    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(normalized_counts)
    
    # Map clusters to levels
    cluster_means = {}
    for i, cluster in enumerate(clusters):
        cluster_means[cluster] = cluster_means.get(cluster, 0) + counts[i]
    
    sorted_clusters = sorted(cluster_means.items(), key=lambda x: x[1])
    level_map = {
        sorted_clusters[0][0]: "Rendah",
        sorted_clusters[1][0]: "Sedang",
        sorted_clusters[2][0]: "Tinggi"
    }
    
    # Add cluster info to each item
    for i, item in enumerate(data):
        item['level'] = level_map[clusters[i]]
        item['normalized_count'] = float(normalized_counts[i][0])
    
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)