'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PricePage() {
  const router = useRouter()

  const [data, setData] = useState<
    | {
        blob_id: string
        cost: number
        created_at: string
        id: string
        payment: 'completed' | 'pending'
        videos: {
          blob_type: 'video' | 'image' | 'pdf'
          blob_url: string
          created_at: string
          id: string
          user_id: string
        } | null
      }[]
    | null
  >([])

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js')
  }, [])

  const supabase = createClient()

  const openPaymentModal = async () => {
    const orderId = await fetch('/api/pay', {
      method: 'POST',
      body: JSON.stringify({ amount: 1000 }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!orderId.ok) {
      console.error('Error creating order')
      return
    }

    const orderIdJson = await orderId.json()

    if (!data) {
      alert('No pending payments')
      return
    }

    const user = (await supabase.auth.getUser()).data.user

    const options = {
      key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID,
      amount: data?.reduce((acc, curr) => acc + curr.cost, 0) * 100,
      currency: 'INR',
      name: user?.email?.split('@')[0],
      description: 'Payment for your videos',
      image: '/favicon.ico',
      order_id: orderIdJson.order.id,
      handler: async function (response: any) {
        if (response.razorpay_payment_id) {
          await supabase
            .from('blob_cost')
            .update({ payment: 'completed' })
            .in(
              'id',
              data?.map((d) => d.id),
            )
        }
        router.refresh()
      },
      prefill: {
        name: user?.email?.split('@')[0],
        email: user?.email,
        contact: '9999999999',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
    }

    const paymentObject = new (window as any).Razorpay(options)
    paymentObject.open()
  }

  const getBlobCostDetails = async () => {
    const { data, error } = await supabase
      .from('blob_cost')
      .select('*, videos(*)')
      .eq('payment', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return []
    }

    setData(data)

    return data
  }

  useEffect(() => {
    getBlobCostDetails()
  }, [])

  return (
    <div className="container mx-auto space-y-8 p-4">
      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
        Cost Estimation
      </h2>

      <Table className="">
        <TableCaption>A list of your invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableCell>Invoice ID</TableCell>
            <TableCell>Blob URL</TableCell>
            <TableCell>Status</TableCell>
            <TableCell className="text-right">Created At</TableCell>
            <TableCell className="text-right">Amount</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>
                <a href={invoice.videos?.blob_url} target="_blank">
                  {invoice.videos?.blob_url.toString().slice(0, 50)}...
                </a>
              </TableCell>
              <TableCell>{invoice.payment.toLocaleUpperCase()}</TableCell>
              <TableCell className="text-right">
                {new Date(invoice.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right"> ₹{invoice.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex w-full justify-end">
        <Button onClick={openPaymentModal}>Pay Now</Button>
      </div>
    </div>
  )
}
