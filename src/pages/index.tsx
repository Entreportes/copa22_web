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
    
    <div className='max-w-[1124px] h-screen mx-auto grid grid-flow-row row-2 justify-between py-10 md:gap-4'>
      <div className='grid md:grid-cols-2 items-center md:gap-24 grid-cols-1'>
        <main className='px-8'>
          <Image src={logoImg} alt="Copa 22"/>
          <h1 className='mt-4 text-white md:text-5xl font-bold leading-tight text-4xl'>
            Crie seu próprio bolão da Copa Catar 2022 e compartilhe com os amigos!
          </h1>

          <div className='mt-10 flex items-center gap-2 '>
            <Image src={usersAvatarExampleImg} alt=""/>
            <strong className='text-gray-100 text-xl flex-1 text-clip ml-5'>
              <span className='text-ignite-500'>+{props.userCount} </span> pessoas já estão usando
            </strong>
          </div>

          <form onSubmit={createPool} className='mt-5 flex gap-2'>
            <input 
              className='flex-1 px-6 py-3 rounded bg-gray-800 border border-gray-600 text-base text-gray-100'
              type="text" 
              required
              placeholder='Qual nome do seu bolão?'
              onChange={event => setPoolTitle(event.target.value)}
              value={poolTitle}
            />
            <button 
              className='bg-yellow-500 px-2 md:px-4 md:py-3 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
              type='submit'>
                Criar meu bolão
            </button>
          </form>
          <p className='text-gray-300 mt-4 text-sm leading-relaxed'>
            Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
          </p>
          <div className='mt-4 text-sm text-gray-300'>
            <span>Faça o download do app </span>
            {/* <a href='https://play.google.com/store/apps/details?id=entreportes.copa22' className='text-green-500'> */}
            <a href='#' className='text-green-500'>
              Copa22 na PlayStore
            </a>
            <span> ou o </span>
            <a href='https://expo.dev/accounts/entreportes/projects/copa22/builds/1c440be4-2598-4a5c-9c66-9b456addc44c' className='text-green-500'>
              executável .APK
            </a>
          </div>

          <div className='mt-5 pt-8 border-t border-gray-600 grid grid-cols-2 justify-between text-gray-100'>
            <div className='flex justify-start gap-6'>
              <Image src={iconCheckImg} alt="" width="40"/>
              <div className='flex flex-col'>
                <span className='font-bold text-2xl'>+{props.poolCount}</span>
                <span>bolões criados</span>
              </div>
            </div>
            <div  className='flex justify-end gap-6'>
              <Image src={iconCheckImg} alt="" width="40"/>
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
            priority
            
          />
          <span className='text-gray-100 font-bold text-xl mt-8'>Regras:
            <span className='text-gray-300 mt-1 ml-2 text-sm leading-relaxed text-justify'>
              <p> - Acertou o placar:          5 pontos</p>
              <p> - Acertou time vencedor:     3 pontos</p>
              <p> - Acertou o empate:          2 pontos</p>
              <p> - Acertou os gols de 1 time: +1 ponto</p>
            </span>
          </span>
        </div>      
      </div>
      <div className=' px-8 py-10'>
        <span className='text-gray-100 font-bold text-xl'>Política de privacidade</span>
        <p className='text-gray-300 mt-1 text-sm leading-relaxed text-justify'>
          Serão coletas apenas as informações de nome, e-mail e foto do perfil da sua conta Google.
          Serão armezanados em nosso servidor apenas as informações disponibilizadas pelo login social 
          nenhuma informação será compartilhada. Essas informações são essenciais para saber quem é o usuário que estará dando os palpites.
        </p>
      </div>
      <p className='text-gray-600 mt-1 text-sm leading-relaxed text-center'>Ⓡ E7 Soluções Integradas</p>
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