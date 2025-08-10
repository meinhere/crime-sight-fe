import Image from 'next/image'

export function Footer() {
    return (
        <footer className="py-8">
            <div className="container mx-auto px-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Left Section - Brand & Description */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <Image
                                        src="/images/logo.png"
                                        alt="CrimeSight Logo"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-black">CrimeSight</h3>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 max-w-md">
                                <p>CrimeSight adalah platform informasi kriminal di Indonesia.</p>
                                <p>Kami berkomitmen menyajikan data yang akurat dan mudah dipahami.</p>
                            </div>
                        </div>

                        {/* Right Section - Copyright */}
                        <div className="text-right">
                            <p className="text-sm text-gray-500">
                                © 2025 CrimeSight. Semua fakta punya dampak.
                            </p>
                            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-4 mt-3">
                                <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                                    Privacy Policy
                                </a>
                                <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                                    Terms of Service
                                </a>
                                <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}