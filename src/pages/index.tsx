import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'


interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {

  const [poolTitle,setPoolTitle] = useState('')

  async function createPool(event: FormEvent){
    event.preventDefault()

    try{
      const response = await api.post('/pools', {
        title: poolTitle,
      });

      const {code} = response.data

      await navigator.clipboard.writeText(code)

      alert("Bolão criado com sucesso, o código foi copiado para a área de transferência!")
      setPoolTitle('')

    } catch(error){
      console.log(error)
      alert('Falha ao criar o bolão, tente novamente.')
      throw(error)
    }


  }


  return (
    <div className='max-w-[1124px] h-screen mx-auto grid md:grid-cols-2 items-center gap-28 grid-cols-1'>
      <main className='px-8'>
        <Image src={logoImg} alt="Copa 22"/>
        <h1 className='mt-4 text-white md:text-5xl font-bold leading-tight text-4xl'>
          Crie seu próprio bolão da copa e compartilhe entre os amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2 '>
          <Image src={usersAvatarExampleImg} alt=""/>
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input 
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text" 
            required
            placeholder='Qual o nome do seu bolão?'
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button 
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
            type='submit'>Criar meu bolão</button>
        </form>
        <p className='text-gray-300 mt-4 text-sm leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas
        </p>
        <a href='https://play.google.com/store/' className='text-green-500 mt-4 text-sm'>
          Faça do download do app Copa22 na PlayStore
        </a>

        <div className='mt-5 pt-8 border-t border-gray-600 grid grid-cols-2 justify-between text-gray-100'>
          <div className='flex justify-start gap-6'>
            <Image src={iconCheckImg} alt=""/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>bolões criados</span>
            </div>
          </div>
          <div  className='flex justify-end gap-6'>
            <Image src={iconCheckImg} alt=""/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>palpites enviados</span>
           </div>
          </div>
        </div>
      
      </main>

      <div className='px-8 mt-10'>
        <Image 
          src= {appPreviewImg}
          alt="Dois celulares mostrando o preview do aplicativo"
          quality={100}
          
        />
        <span className='text-gray-100 font-bold text-xl'>Política de privacidade</span>
        <p className='text-gray-300 mt-4 text-sm leading-relaxed'>
          Serão coletas apenas as informações de NOME, E-MAIL, ID do Google e FOTO DO PERFIL na conta Google.
          Serão armezanados em nosso servidor apenas as informações disponibilizadas pelo login social 
          nenhuma informação será compartilhada. Essas informações são essenciais para saber quem é o usuário que estará dando os palpites.
        </p>
      </div>
      
    </div>
  )
}


//VERFICAR getStaticProps
export const getServerSideProps = async () => {
  
  let poolCount
  let guessCount
  let userCount
  // try{
  //   const serverOnline = api.
  // }catch(error){
  //   poolCount= 20
  //   guessCount= 350
  //   userCount= 90
  //   return{
  //     props: {
  //       poolCount,
  //       guessCount,
  //       userCount,
  //     }
  //   }
  // }


  try{
    //console.log(api.request)
    const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
      api.get('pools/count'),
      api.get('guesses/count'),
      api.get('users/count')
    ])
    poolCount = poolCountResponse.data.count
    guessCount = guessCountResponse.data.count
    userCount = userCountResponse.data.count
      
    
    
  }catch(error){
    console.log(error)
    poolCount= 20
    guessCount= 350
    userCount= 90
    throw (error)
      
  } finally{
    return{
      props: {
        poolCount,
        guessCount,
        userCount,
      }
    }
  }
  

}