'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle forgot password logic here
        console.log('Reset password for:', email)
        setIsSubmitted(true)
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                                <div className="w-6 h-3 bg-white rounded-full"></div>
                            </div>
                            <span className="text-2xl font-bold text-black">CrimeSight</span>
                        </div>
                    </div>

                    <Card className="border-2 border-black shadow-lg">
                        <CardHeader className="space-y-1">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                                    <Mail size={32} className="text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center text-black">
                                Check Your Email
                            </CardTitle>
                            <CardDescription className="text-center text-gray-600">
                                We've sent a password reset link to <br />
                                <span className="font-medium text-black">{email}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600 text-center">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                onClick={() => setIsSubmitted(false)}
                                variant="outline"
                                className="w-full border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                            >
                                Try Another Email
                            </Button>
                            <Link
                                href="/login"
                                className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors"
                            >
                                <ArrowLeft size={16} />
                                <span>Back to Sign In</span>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-3">
                        <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
                        <span className="text-2xl font-bold text-black">CrimeSight</span>
                    </div>
                </div>

                <Card className="border-2 border-black shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-black">
                            Forgot Password?
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Enter your email address and we'll send you a link to reset your password
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-black font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-2 border-gray-300 focus:border-black transition-colors"
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 transition-colors mt-2"
                            >
                                Send Reset Link
                            </Button>
                            <Link
                                href="/login"
                                className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors"
                            >
                                <ArrowLeft size={16} />
                                <span>Back to Sign In</span>
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}