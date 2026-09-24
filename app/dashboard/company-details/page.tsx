"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { saveCompanyDetails, getCompanyDetails } from "@/app/actions/onboarding"

export default function CompanyDetailsPage() {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    primaryContact: "",
    secondaryContact: "",
    email: "",
    address: "",
    citizenship: "South African",
    idNumber: "",
    passportNumber: "",

    // Company Information
    companyName: "",
    companyRegistrationNumber: "",
    vatNumber: "",
    companyAddress: "",
    industry: "",

    // SARS eFiling
    efilingUsername: "",
    efilingPassword: "",
    consent: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCompanyDetails = async () => {
      setIsLoading(true)
      try {
        const result = await getCompanyDetails()
        if (result.success && result.data) {
          const data = result.data
          setFormData({
            fullName: data.contact_name,
            primaryContact: data.mobile,
            secondaryContact: data.contact_details,
            email: data.email_address,
            address: data.address,
            citizenship: data.citizenship,
            idNumber: data.id_number,
            passportNumber: "",
            companyName: data.company_name,
            companyRegistrationNumber: data.company_registration_number || "",
            vatNumber: data.company_tax_number,
            companyAddress: data.address,
            industry: data.industry || "",
            efilingUsername: data.efiling_login_details?.username || "",
            efilingPassword: data.efiling_login_details?.password || "",
            consent: data.e_sign,
          })
        }
      } catch (error) {
        console.error("Failed to load company details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCompanyDetails()
  }, [])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Personal Information validation
    if (!formData.fullName) newErrors.fullName = "Full name is required"
    if (!formData.primaryContact) newErrors.primaryContact = "Primary contact number is required"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.address) newErrors.address = "Address is required"

    if (formData.citizenship === "South African") {
      if (!formData.idNumber) newErrors.idNumber = "ID number is required"
      else if (!/^\d{13}$/.test(formData.idNumber)) newErrors.idNumber = "ID number must be 13 digits"
    } else {
      if (!formData.passportNumber) newErrors.passportNumber = "Passport number is required"
    }

    // Company Information validation
    if (!formData.companyName) newErrors.companyName = "Company name is required"
    if (!formData.companyRegistrationNumber) newErrors.companyRegistrationNumber = "Registration number is required"
    if (!formData.vatNumber) newErrors.vatNumber = "VAT number is required"
    if (!formData.companyAddress) newErrors.companyAddress = "Company address is required"

    // SARS eFiling validation
    if (!formData.efilingUsername) newErrors.efilingUsername = "eFiling username is required"
    if (!formData.efilingPassword) newErrors.efilingPassword = "eFiling password is required"
    if (!formData.consent) newErrors.consent = "You must consent to authorize Vatify"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await saveCompanyDetails({
        contactName: formData.fullName,
        contactDetails: formData.secondaryContact,
        companyName: formData.companyName,
        companyRegistrationNumber: formData.companyRegistrationNumber,
        industry: formData.industry,
        address: formData.address,
        idNumber: formData.citizenship === "South African" ? formData.idNumber : formData.passportNumber,
        citizenship: formData.citizenship as "South African" | "Non South African",
        companyTaxNumber: formData.vatNumber,
        emailAddress: formData.email,
        mobile: formData.primaryContact,
        efilingUsername: formData.efilingUsername,
        efilingPassword: formData.efilingPassword,
        eSign: formData.consent,
      })

      if (result.success) {
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 3000)
      } else {
        setErrors({ form: result.error || "Failed to save company details. Please try again." })
      }
    } catch (error) {
      setErrors({ form: "Failed to save company details. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading company details...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Company Details</h1>
        <p className="text-gray-600 mt-2">
          Please provide your personal and company information to complete your profile.
        </p>
      </div>

      {errors.form && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.form}</AlertDescription>
        </Alert>
      )}

      {submitSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">Company details saved successfully!</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="company">Company Information</TabsTrigger>
            <TabsTrigger value="efiling">SARS eFiling</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-primary">Personal Information</CardTitle>
                <CardDescription>Provide your personal contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className={`border-accent/30 focus-visible:ring-primary ${
                        errors.fullName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`border-accent/30 focus-visible:ring-primary ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryContact">
                      Primary Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="primaryContact"
                      value={formData.primaryContact}
                      onChange={(e) => handleChange("primaryContact", e.target.value)}
                      className={`border-accent/30 focus-visible:ring-primary ${
                        errors.primaryContact ? "border-red-500" : ""
                      }`}
                    />
                    {errors.primaryContact && <p className="text-sm text-red-500">{errors.primaryContact}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryContact">Secondary Contact Number</Label>
                    <Input
                      id="secondaryContact"
                      value={formData.secondaryContact}
                      onChange={(e) => handleChange("secondaryContact", e.target.value)}
                      className="border-accent/30 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Residential Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className={`border-accent/30 focus-visible:ring-primary ${errors.address ? "border-red-500" : ""}`}
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citizenship">
                    Citizenship <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.citizenship} onValueChange={(value) => handleChange("citizenship", value)}>
                    <SelectTrigger className="border-accent/30 focus:ring-primary">
                      <SelectValue placeholder="Select citizenship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="South African">South African</SelectItem>
                      <SelectItem value="Foreign National">Foreign National</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.citizenship === "South African" ? (
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">
                      ID Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="idNumber"
                      value={formData.idNumber}
                      onChange={(e) => handleChange("idNumber", e.target.value)}
                      className={`border-accent/30 focus-visible:ring-primary ${
                        errors.idNumber ? "border-red-500" : ""
                      }`}
                    />
                    {errors.idNumber && <p className="text-sm text-red-500">{errors.idNumber}</p>}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="passportNumber">
                      Passport Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="passportNumber"
                      value={formData.passportNumber}
                      onChange={(e) => handleChange("passportNumber", e.target.value)}
                      className={`border-accent/30 focus-visible:ring-primary ${
                        errors.passportNumber ? "border-red-500" : ""
                      }`}
                    />
                    {errors.passportNumber && <p className="text-sm text-red-500">{errors.passportNumber}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-primary">Company Information</CardTitle>
                <CardDescription>Provide details about your company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      className={`border-accent/30 focus-visible:ring-primary ${
                        errors.companyName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyRegistrationNumber">
                      Company Registration Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="companyRegistrationNumber"
                      value={formData.companyRegistrationNumber}
                      onChange={(e) => handleChange("companyRegistrationNumber", e.target.value)}
                      className={`border-accent/30 focus-visible:ring-primary ${
                        errors.companyRegistrationNumber ? "border-red-500" : ""
                      }`}
                    />
                    {errors.companyRegistrationNumber && (
                      <p className="text-sm text-red-500">{errors.companyRegistrationNumber}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">
                      VAT Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="vatNumber"
                      value={formData.vatNumber}
                      onChange={(e) => handleChange("vatNumber", e.target.value)}
                      className={`border-accent/30 focus-visible:ring-primary ${
                        errors.vatNumber ? "border-red-500" : ""
                      }`}
                    />
                    {errors.vatNumber && <p className="text-sm text-red-500">{errors.vatNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => handleChange("industry", value)}>
                      <SelectTrigger className="border-accent/30 focus:ring-primary">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="services">Professional Services</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">
                    Company Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="companyAddress"
                    value={formData.companyAddress}
                    onChange={(e) => handleChange("companyAddress", e.target.value)}
                    className={`border-accent/30 focus-visible:ring-primary ${
                      errors.companyAddress ? "border-red-500" : ""
                    }`}
                  />
                  {errors.companyAddress && <p className="text-sm text-red-500">{errors.companyAddress}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="efiling">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-primary">SARS eFiling Credentials</CardTitle>
                <CardDescription>
                  Provide your SARS eFiling credentials to enable Vatify to process VAT returns on your behalf
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    Your credentials are encrypted and securely stored. Vatify will only use these credentials to
                    process VAT returns on your behalf.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="efilingUsername">
                      eFiling Username <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="efilingUsername"
                      value={formData.efilingUsername}
                      onChange={(e) => handleChange("efilingUsername", e.target.value)}
                      className={`border-accent/30 focus-visible:ring-primary ${
                        errors.efilingUsername ? "border-red-500" : ""
                      }`}
                    />
                    {errors.efilingUsername && <p className="text-sm text-red-500">{errors.efilingUsername}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="efilingPassword">
                      eFiling Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="efilingPassword"
                      type="password"
                      value={formData.efilingPassword}
                      onChange={(e) => handleChange("efilingPassword", e.target.value)}
                      className={`border-accent/30 focus-visible:ring-primary ${
                        errors.efilingPassword ? "border-red-500" : ""
                      }`}
                    />
                    {errors.efilingPassword && <p className="text-sm text-red-500">{errors.efilingPassword}</p>}
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-4">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => handleChange("consent", checked === true)}
                    className={errors.consent ? "border-red-500" : ""}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="consent"
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        errors.consent ? "text-red-500" : ""
                      }`}
                    >
                      I authorize Vatify to use my SARS eFiling credentials to act on my behalf on the SARS eFiling
                      platform for the purpose of processing VAT returns.
                    </Label>
                    {errors.consent && <p className="text-sm text-red-500">{errors.consent}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Company Details
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
