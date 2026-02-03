import { useState } from 'react';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('https://formsubmit.co/ajax/chelseaperfect24@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Portfolio message from ${form.name}`,
        }),
      });

      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center" style={{ paddingLeft: '15%', paddingRight: '10%' }}>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white/90 tracking-wider font-mono mb-16">
        Send Me a Message~
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10 w-full">
        <div>
          <label className="block text-xs text-white/40 font-mono uppercase tracking-[0.2em] mb-3">
            Your name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full bg-white/[0.06] border-b border-white/15 px-2 py-3 text-white text-sm font-mono outline-none focus:border-white/40 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 font-mono uppercase tracking-[0.2em] mb-3">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-white/[0.06] border-b border-white/15 px-2 py-3 text-white text-sm font-mono outline-none focus:border-white/40 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 font-mono uppercase tracking-[0.2em] mb-3">
            Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full bg-white/[0.06] border-b border-white/15 px-2 py-3 text-white text-sm font-mono outline-none focus:border-white/40 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="self-start mt-6 border border-white/25 px-12 py-4 text-sm md:text-base font-mono uppercase tracking-[0.25em] text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : status === 'error' ? 'Failed, retry' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
