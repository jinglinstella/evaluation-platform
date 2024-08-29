import React from 'react'
import EvalReport from 'src/sections/evaluations/report/view/eval-report'

interface Props{
  params: {
      id: string;
  }
}

const page = ({params}: Props) => {
  return (
    <div>
      <EvalReport eval_id={params.id}/>
    </div>
  )
}

export default page
