"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Loader2, User, Mail, Lock, AlertTriangle, Check, X, UserPlus } from "lucide-react"
import { signUpSchema, type SignUpFormData, validatePasswordStrength } from "@/lib/validations/auth"
import axios from "axios"
import debounce from "lodash.debounce"

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(validatePasswordStrength(""))
  const router = useRouter()

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange"
  })

  const watchPassword = form.watch("password", "")

  // Update password strength in real-time
  useEffect(() => {
    setPasswordStrength(validatePasswordStrength(watchPassword))
  }, [watchPassword])

  // Debounced username check
  const checkUsername = useCallback(
    debounce(async (newUsername: string) => {
      if (!newUsername) {
        setUsernameError(null)
        setIsCheckingUsername(false)
        return
      }
      
      if (newUsername.length < 3) {
        setUsernameError("Username must be at least 3 characters long")
        setIsCheckingUsername(false)
        return
      }

      setIsCheckingUsername(true)
      try {
        const { data } = await axios.post("/api/user/username-check", { username: newUsername })
        if (data.exists) {
          setUsernameError("Username is already taken")
        } else {
          setUsernameError(null)
        }
      } catch (error) {
        console.error("Username check error:", error)
        setUsernameError("Error checking username availability")
      } finally {
        setIsCheckingUsername(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    checkUsername(username)
  }, [username, checkUsername])

  const handleUsernameChange = (value: string) => {
    const newUsername = value.replace(/\s+/g, '') // Remove spaces
    setUsername(newUsername)
    form.setValue("username", newUsername, { shouldValidate: true })
  }

  const onSubmit = async (data: SignUpFormData) => {
    if (usernameError) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await axios.post('/api/user', {
        fullName: data.name.trim(),
        username: data.username.trim(),
        email: data.email.toLowerCase(),
        password: data.password,
      })
      
      setSuccess("Account created successfully! Redirecting to sign in...")
      setTimeout(() => {
        router.push("/sign-in")
      }, 2000)
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create account. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getStrengthVariant = (strength: number): "destructive" | "secondary" | "default" => {
    if (strength <= 2) return "destructive"
    if (strength <= 4) return "secondary"
    return "default"
  }

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return "Weak"
    if (strength <= 4) return "Medium"
    return "Strong"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="w-full max-w-md">
        <Card className="border border-gray-700/50 shadow-2xl bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-400">
              Join Pieces to start sharing your code with the world
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-700 bg-red-900/20">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-700 bg-green-900/20">
                    <Check className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-400">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            type="text"
                            placeholder="Enter your full name"
                            disabled={isLoading}
                            className="pl-10 h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Username
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            type="text"
                            placeholder="Choose a username"
                            disabled={isLoading}
                            className={`pl-10 pr-10 h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 ${
                              form.formState.errors.username || usernameError ? "border-red-500" : 
                              username && !usernameError ? "border-green-500" : ""
                            }`}
                            {...field}
                            onChange={(e) => {
                              handleUsernameChange(e.target.value)
                              field.onChange(e)
                            }}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isCheckingUsername ? (
                              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            ) : username && !usernameError ? (
                              <Check className="h-4 w-4 text-green-400" />
                            ) : usernameError ? (
                              <X className="h-4 w-4 text-red-400" />
                            ) : null}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {usernameError && (
                        <p className="text-sm text-red-400 flex items-center mt-1">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {usernameError}
                        </p>
                      )}
                      {username && !usernameError && !isCheckingUsername && (
                        <p className="text-sm text-green-400 flex items-center mt-1">
                          <Check className="w-4 h-4 mr-1" />
                          Username is available
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            disabled={isLoading}
                            className="pl-10 h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            disabled={isLoading}
                            className="pl-10 pr-12 h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-700/50"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      
                      {/* Password strength indicator */}
                      {watchPassword && (
                        <div className="space-y-3 mt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Password strength:</span>
                            <Badge 
                              variant={getStrengthVariant(passwordStrength.strength)} 
                              className={`text-xs ${
                                passwordStrength.strength <= 2 ? 'bg-red-900 text-red-300' :
                                passwordStrength.strength <= 4 ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'
                              }`}
                            >
                              {getStrengthText(passwordStrength.strength)}
                            </Badge>
                          </div>
                          <Progress 
                            value={(passwordStrength.strength / 6) * 100} 
                            className="w-full h-2 bg-gray-700"
                          />
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className={`flex items-center ${passwordStrength.minLength ? 'text-green-400' : 'text-gray-500'}`}>
                              {passwordStrength.minLength ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                              8+ characters
                            </div>
                            <div className={`flex items-center ${passwordStrength.hasUppercase ? 'text-green-400' : 'text-gray-500'}`}>
                              {passwordStrength.hasUppercase ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                              Uppercase
                            </div>
                            <div className={`flex items-center ${passwordStrength.hasLowercase ? 'text-green-400' : 'text-gray-500'}`}>
                              {passwordStrength.hasLowercase ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                              Lowercase
                            </div>
                            <div className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                              {passwordStrength.hasNumber ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                              Number
                            </div>
                            <div className={`flex items-center ${passwordStrength.hasSpecialChar ? 'text-green-400' : 'text-gray-500'}`}>
                              {passwordStrength.hasSpecialChar ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                              Special char
                            </div>
                            <div className={`flex items-center ${passwordStrength.noSpaces ? 'text-green-400' : 'text-gray-500'}`}>
                              {passwordStrength.noSpaces ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                              No spaces
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            disabled={isLoading}
                            className="pl-10 pr-12 h-12 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoading}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-700/50"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  variant="default"
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading || !!usernameError || isCheckingUsername || !passwordStrength.isValid}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-800 px-2 text-gray-500">Already have an account?</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full border-gray-600 bg-gray-900/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  asChild
                >
                  <Link href="/sign-in">
                    Sign In Instead
                  </Link>
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <Link href="/terms-of-service" className="text-blue-400 hover:underline font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-blue-400 hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}