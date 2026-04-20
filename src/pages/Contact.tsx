import { PageLayout } from "@/src/components/layout/PageLayout"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Badge } from "@/src/components/ui/badge"
import { Mail, MessageSquare, Phone, ArrowUpRight, Globe, Clock, MapPin, Github, Linkedin } from "lucide-react"
import { useLanguage } from "@/src/context/LanguageContext"
import { SEO } from "@/src/components/layout/SEO"

export default function Contact() {
  const { t } = useLanguage()

  return (
    <PageLayout>
      <SEO 
        title={t("seo.contact.title")} 
        description={t("seo.contact.desc")}
        path="/contact"
      />
      <div className="page-fade-in pb-32">
        {/* Dynamic Header */}
        <section className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
          <div className="max-w-5xl">
            <span className="text-primary font-black text-xs tracking-[1em] uppercase mb-8 block reveal">{t("contact.conversation")}</span>
            <h1 className="text-5xl md:text-[200px] display-bold leading-[0.75] mb-12 reveal tracking-[-0.08em]">
              SAY <br /> <span className="text-primary italic">{t("contact.hello")}</span>
            </h1>
            <p className="text-xl md:text-5xl text-foreground font-light reveal leading-tight max-w-3xl">
              {t("contact.description")}
            </p>
          </div>
        </section>

        <section className="py-24 px-6 max-w-7xl mx-auto border-t">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Contact Details (Left) */}
            <div className="lg:col-span-5 space-y-24 reveal">
              <div className="space-y-12">
                <h3 className="text-xs font-black uppercase tracking-[0.5em] text-muted-foreground opacity-50">{t("contact.synaptic")}</h3>
                <div className="space-y-10">
                  <div className="group cursor-pointer">
                    <div className="flex items-center gap-6 mb-2">
                       <Mail className="h-5 w-5 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("contact.correspondence")}</span>
                    </div>
                    <p className="text-3xl md:text-4xl font-black tracking-tighter group-hover:text-primary transition-colors">support@rumahtechno.cc</p>
                  </div>
                  
                  <div className="group cursor-pointer">
                    <div className="flex items-center gap-6 mb-2">
                       <Phone className="h-5 w-5 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("contact.frequency")}</span>
                    </div>
                    <p className="text-3xl md:text-4xl font-black tracking-tighter group-hover:text-primary transition-colors">{t("contact.phone")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <h3 className="text-xs font-black uppercase tracking-[0.5em] text-muted-foreground opacity-50">{t("contact.coordinates")}</h3>
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                       <MapPin className="h-4 w-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{t("contact.city")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                      {t("contact.address")}
                    </p>
                    
                    {/* Google Maps iFrame */}
                    <div className="w-full aspect-video border border-border/50 bg-muted/20 overflow-hidden">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.1246105073014!2d112.77908377543925!3d-7.2266249927793735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f9b4bee01d8d%3A0xb75fd93f49f82bd1!2sJl.%20Kalilom%20Lor%20Indah%20Gg.%20Pacar%2C%20Tanah%20Kali%20Kedinding%2C%20Kec.%20Kenjeran%2C%20Surabaya%2C%20Jawa%20Timur%2060129!5e0!3m2!1sid!2sid!4v1776591336533!5m2!1sid!2sid" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <h3 className="text-xs font-black uppercase tracking-[0.5em] text-muted-foreground opacity-50">{t("contact.cycle")}</h3>
                <div className="flex items-center gap-8">
                   <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest">{t("contact.monFri")}</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest">{t("contact.globalOps")}</span>
                   </div>
                </div>
              </div>

              <div className="space-y-12">
                <h3 className="text-xs font-black uppercase tracking-[0.5em] text-muted-foreground opacity-50">{t("contact.social") || "MEDIA SOSIAL"}</h3>
                <div className="flex items-center justify-start gap-6">
                   <a href="https://linkedin.com/in/hanifabdurrohim" target="_blank" rel="noopener noreferrer" className="group">
                      <div className="w-12 h-12 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                         <Linkedin className="h-5 w-5" />
                      </div>
                   </a>
                   <a href="https://github.com/dextryayers" target="_blank" rel="noopener noreferrer" className="group">
                      <div className="w-12 h-12 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                         <Github className="h-5 w-5" />
                      </div>
                   </a>
                   <a href="https://instagram.com/hanziip.kds" target="_blank" rel="noopener noreferrer" className="group">
                      <div className="w-12 h-12 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                         <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2m-.5 2c-2 0-3.3 1.3-3.3 3.3v8.8c0 2 1.3 3.3 3.3 3.3h9.4c2 0 3.3-1.3 3.3-3.3V7.3c0-2-1.3-3.3-3.3-3.3H7.3m9.6 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3m-5.1 1.4c2.7 0 4.9 2.2 4.9 4.9s-2.2 4.9-4.9 4.9-4.9-2.2-4.9-4.9 2.2-4.9 4.9-4.9m0 2c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z"/></svg>
                      </div>
                   </a>
                </div>
              </div>
            </div>

            {/* Contact Form (Right) */}
            <div className="lg:col-span-7 reveal">
              <div className="bg-muted/10 border border-border/50 p-10 md:p-20 rounded-[3.5rem] relative overflow-hidden group shadow-2xl backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                
                <h3 className="text-3xl md:text-7xl display-bold mb-12">{t("contact.form.journey")}</h3>
                
                <form className="space-y-10 relative z-10" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("contact.form.firstName")}</label>
                      <Input placeholder="E.g. John" className="h-14 border-x-0 border-t-0 border-b-2 border-border focus:border-primary bg-transparent rounded-none px-0 text-xl font-medium focus-visible:ring-0 placeholder:opacity-30" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("contact.form.lastName")}</label>
                      <Input placeholder="E.g. Doe" className="h-14 border-x-0 border-t-0 border-b-2 border-border focus:border-primary bg-transparent rounded-none px-0 text-xl font-medium focus-visible:ring-0 placeholder:opacity-30" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("contact.form.email")}</label>
                    <Input type="email" placeholder="john@domain.com" className="h-14 border-x-0 border-t-0 border-b-2 border-border focus:border-primary bg-transparent rounded-none px-0 text-xl font-medium focus-visible:ring-0 placeholder:opacity-30" />
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("contact.form.classification")}</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        t("contact.form.options.fullProduct"),
                        t("contact.form.options.branding"),
                        t("contact.form.options.neuralUI"),
                        t("contact.form.options.consultation")
                      ].map(option => (
                        <button key={option} type="button" className="px-6 py-3 rounded-full border border-border text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("contact.form.brief")}</label>
                    <Textarea placeholder={t("contact.form.placeholderBrief")} className="min-h-[180px] border-x-0 border-t-0 border-b-2 border-border focus:border-primary bg-transparent rounded-none px-0 text-xl font-medium focus-visible:ring-0 placeholder:opacity-30 resize-none" />
                  </div>

                  <Button className="w-full h-20 rounded-full font-black uppercase tracking-[0.2em] text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 group">
                    {t("contact.transmission")}
                    <ArrowUpRight className="ml-4 h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
