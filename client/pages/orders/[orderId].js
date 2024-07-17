import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router'
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date(); //resultado em milisegundos
      setTimeLeft(Math.round(msLeft / 1000)) //resultado em segundos
    }

    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    // função p/ evitar que o timer fique rodando p/ sempre
    return () => {
      clearInterval(timerId)
    }
  }, []) // [] p/ garantir que essa função será chamada apenas qndo o componente aparecer pela primeira vez na tela

  if (timeLeft < 0) {
    return <div>Order expired!</div>
  }

  return <div>
    Time left to pay: {timeLeft} seconds 
    <StripeCheckout
      token={({ id }) => doRequest({ token: id })}
      stripeKey="pk_test_51PcdlPRx3ZYGNmJBUVCLS0yqvPREBa26Ikm4tCFHLlXJtNhN1W1xXrjo1Cr0YgFpbg4hENYLB0NmWDwftIjUIXe4006O0UAevA"
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
  </div>
}

OrderShow.getInitialProps = async (context, client) => {

  const { orderId } = context.query // especificamente orderId pois é o nome no nosso arquivo [orderId]
  const { data } = await client.get(`/api/orders/${orderId}`) // obtendo infos da order através do axios response

  return { order: data }
}

export default OrderShow;

// getInitialProps accepts a single and optional context parameter. The context objects contains: req, res, params, query....