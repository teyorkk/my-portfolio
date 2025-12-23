"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Loader2, CheckCircle, XCircle, X } from "lucide-react"
import { useState } from "react"
import emailjs from "@emailjs/browser"

function CustomDialog({ 
  isOpen, 
  onClose, 
  status, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  status: 'success' | 'error' | 'idle'; 
  message: string 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-background border rounded-lg shadow-lg p-6"
          >
            <button 
              onClick={onClose} 
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              {status === 'success' ? (
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                   <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                   <XCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {status === 'success' ? 'Success!' : 'Error'}
                </h3>
                <p className="text-muted-foreground">
                  {message}
                </p>
              </div>
              <Button onClick={onClose} className="w-full mt-2">
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    status: 'success' | 'error' | 'idle';
    message: string;
  }>({
    isOpen: false,
    status: 'idle',
    message: ''
  })

  const closeDialog = () => setDialogState(prev => ({ ...prev, isOpen: false }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting || isCooldown) return

    setIsSubmitting(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const name = String(formData.get("name") || "")
    const email = String(formData.get("email") || "")
    const subject = String(formData.get("subject") || "")
    const message = String(formData.get("message") || "")

    const templateParams = {
      name,
      email,
      subject,
      message,
      reply_to: email,
    }

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("Email service misconfigured. Please contact me directly.")
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)
      form.reset()
      setDialogState({
        isOpen: true,
        status: 'success',
        message: 'Message sent successfully! I will get back to you soon.'
      })
    } catch (err: unknown) {
      console.error("EmailJS send failed", err)
       const errorMessage =
          err && typeof err === "object" && "text" in err
            ? (err as { text?: string }).text || ""
            : err instanceof Error
            ? err.message
            : "An unexpected error occurred.";
      
      setDialogState({
        isOpen: true,
        status: 'error',
        message: errorMessage || "Failed to send message. Please try again."
      })
    } finally {
      setIsSubmitting(false)
      setIsCooldown(true)
      setTimeout(() => setIsCooldown(false), 2000)
    }
  }

  return (
    <section id="contact" className="py-20 bg-background relative scroll-mt-28 md:scroll-mt-32">
      <CustomDialog 
        isOpen={dialogState.isOpen} 
        onClose={closeDialog} 
        status={dialogState.status} 
        message={dialogState.message} 
      />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              Let&apos;s Work Together
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Have a project in mind? I&apos;d love to hear about it. Send me a message and I&apos;ll get back to you as soon as possible.
            </p>
            
            <div className="flex items-center space-x-4 text-muted-foreground">
               <Mail className="h-6 w-6 text-primary" />
               <span>moisestheotatienza@gmail.com</span>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: false }}
             transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input name="name" placeholder="Name" required />
                    </div>
                    <div className="space-y-2">
                      <Input name="email" type="email" placeholder="Email" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Input name="subject" placeholder="Subject" required />
                  </div>
                  <div className="space-y-2">
                    <Textarea name="message" placeholder="Your Message" className="min-h-[150px]" required />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting || isCooldown}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : isCooldown ? (
                      "Please wait..." 
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
