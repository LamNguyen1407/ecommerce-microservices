import { auth } from "@clerk/nextjs/server"

const TestPage = async () => {
    const {getToken} = await auth();
    const token = await getToken();

    console.log('Clerk Token:',token);



  return (
    <div>page</div>
  )
}

export default TestPage