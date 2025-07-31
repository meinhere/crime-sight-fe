'use client'

import { useState } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'

interface SearchBarProps {
    onSearch: (query: string) => void
    placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Cari Kasus" }: SearchBarProps) {
    const [query, setQuery] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query)
    }

    const handleClear = () => {
        setQuery('')
        onSearch('')
    }

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 pl-12 pr-12 text-gray-900 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent shadow-sm"
                    />

                    {/* Search Icon */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <IconSearch className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Clear Button */}
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute inset-y-0 right-0 flex items-center pr-4"
                        >
                            <IconX className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}