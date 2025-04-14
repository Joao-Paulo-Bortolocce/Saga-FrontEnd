import logoPrefeitura from "../assets/images/logoPrefeitura.png";
import imagemFundoPrefeitura from "../assets/images/imagemFundoPrefeitura.png";
 
 export default function Telas({ titulo, children }) {
     return (
       <div className="min-h-screen bg-zinc-800 text-white"
       style={{
        backgroundImage: `url(${imagemFundoPrefeitura})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
       >
         <nav className="bg-gray-500 p-4">
           <img src={logoPrefeitura} alt="logoPrefeitura" className="h-24 w-auto"/>
         </nav>
         <main className="p-10">
           <h2 className="text-4xl font-bold text-center mb-6">{titulo}</h2>
           {children}
         </main>
       </div>
     );
 }