export function Footer() {
    return (
        <footer className="bg-gray-200 border-t border-gray-300 py-4">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        © 2024 CrimeSight. All rights reserved.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-sm text-gray-600 hover:text-black">
                            Privacy
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-black">
                            Terms
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-black">
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}