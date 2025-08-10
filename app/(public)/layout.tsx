import { Footer } from '@/components/footer'
import { PublicNavbar } from '@/components/public-navbar'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#f4f4f4]">
            <PublicNavbar />
            <main className="p-6">
                <div className="container mx-auto rounded-lg min-h-[calc(100vh-200px)]">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    )
}