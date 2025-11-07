import { FormEvent, useState } from 'react'
import { submitWaitlistEmail } from '@/services/waitlist'

export default function Home() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!email) {
            setStatus('error')
            setErrorMessage('Please enter a valid email before joining.')
            return
        }

        try {
            setStatus('loading')
            const res = await submitWaitlistEmail(email, 'polyquant')
            if ('ok' in res && res.ok) {
                setStatus('success')
                setEmail('')
                setErrorMessage('')
            } else {
                setStatus('error')
                const message = 'error' in res ? res.error : undefined
                const detail = 'detail' in res ? res.detail : undefined
                const resolvedMessage = detail ?? message ?? 'Something went wrong. Please try again.'
                setErrorMessage(resolvedMessage)
                console.error(res)
            }
        } catch (error) {
            console.error(error)
            setStatus('error')
            setErrorMessage('We ran into a connection issue. Please try again in a moment.')
        }
    }

    return (
        <div className='w-screen h-screen'>
            <img src={'landing.svg'} alt='landing' className='w-full h-full object-fit-contain' />
            <div className='absolute bottom-[5%] left-[5%] flex w-full max-w-xl flex-col gap-6 rounded-[12px] bg-white/95 p-6 text-neutral-900 shadow-[2px_2px_8px_rgba(0,0,0,0.35)] ring-1 ring-fuchsia-500/60 backdrop-blur-sm'>
                <h1 className='text-2xl font-medium leading-tight tracking-tight'>
                    The DeFi Vault Hub for Smarter Yield.
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className='flex flex-col gap-4 rounded-[12px] border border-fuchsia-500/70 bg-white px-5 py-4 shadow-[2px_2px_4px_rgba(0,0,0,0.45)] sm:flex-row sm:items-center sm:gap-6'
                >
                    <label
                        className='flex grow flex-col gap-1 text-sm font-medium text-neutral-600'
                        htmlFor='waitlist-email'
                    >
                        <input
                            id='waitlist-email'
                            name='email'
                            type='email'
                            placeholder='you@example.com'
                            autoComplete='email'
                            value={email}
                            onChange={(event) => {
                                if (status !== 'idle') {
                                    setStatus('idle')
                                }
                                setEmail(event.target.value)
                            }}
                            className='w-full rounded-md border-none px-3 py-2 text-base font-normal text-neutral-900 outline-hidden focus:ring-0 placeholder:italic'
                        />
                    </label>

                    <button
                        type='submit'
                        className='inline-flex h-12 min-w-[8.5rem] items-center justify-center rounded-[4px] bg-[#F0F] px-6 text-base font-semibold text-white shadow-[2px_2px_0_0_rgba(0,0,0,0.53)] transition hover:bg-fuchsia-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500 disabled:cursor-not-allowed disabled:bg-fuchsia-300'
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Submitting…' : 'Join the Waitlist'}
                    </button>
                </form>

                {status === 'success' ? (
                    <p className='text-sm font-medium text-emerald-600'>Thanks! We will be in touch soon.</p>
                ) : null}

                {status === 'error' ? (
                    <p className='text-sm font-medium text-red-600'>
                        {errorMessage || 'Something went wrong. Please try again.'}
                    </p>
                ) : null}
            </div>
        </div>
    )
}
