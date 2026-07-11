import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen  bg-slate-950 text-white pt-48 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-3">
          Get in touch
        </p>
        <h1 className="text-3xl !text-white sm:text-4xl font-bold mb-4">
          Questions about your stay?
        </h1>
        <p className="text-slate-400 max-w-xl mb-12">
          Reach the front desk directly — no bots, no call centre. We reply the same day.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
              <Phone className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-sm font-semibold !text-slate-300 mb-1">Phone</h2>
            <a href="tel:+9779800000000" className="text-lg font-semibold text-white hover:text-indigo-400 transition-colors">
              +977 980-000-0000
            </a>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-sm font-semibold !text-slate-300 mb-1">Email</h2>
            <a href="mailto:test@gmail.com" className="text-lg font-semibold text-white hover:text-indigo-400 transition-colors">
              test@gmail.com
            </a>
          </div>

          <div className="bg-slate-900s border border-slate-700 rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-sm font-semibold !text-slate-300 mb-1">Address</h2>
            <p className="text-white font-medium">Thamel, Kathmandu, Nepal</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-sm font-semibold !text-slate-300 mb-1">Front desk hours</h2>
            <p className="text-white font-medium">24 hours, every day</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
