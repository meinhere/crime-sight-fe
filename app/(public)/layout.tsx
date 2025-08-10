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
            <main>
                <div className="container mx-auto rounded-lg p-6 min-h-[calc(100vh-200px)]">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    )
}