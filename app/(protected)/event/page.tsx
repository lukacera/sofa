"use client"
import React from 'react'
import Header from '../components/Header'
import { Clock, Pencil, TagIcon } from 'lucide-react'
import { CldImage } from 'next-cloudinary'
import TicketSection from '../components/SingleEventComponents/TicketSection'

export default function page() {
  return (
    <div className='min-h-screen max-w-screen'>
      <Header />
      <main className='px-40 w-full h-full'>
        <section className='w-full h-full mt-20'>
          {/* Event Header Section */}
          <div className='w-full grid grid-cols-[35%_65%] gap-20'>
            <div className='flex flex-col gap-7'>
              <div className='flex flex-col gap-3'>
                <h1 className='text-4xl font-bold'>
                  Event name
                </h1>
                <div className='flex items-center gap-2'>
                  <div className='w-4 aspect-square rounded-full bg-blue-300'></div>
                  <h3>
                    Company name
                  </h3>
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <Clock size={18}/>
                  19th September 2025
                </div>
              </div>
              <div className='flex flex-wrap gap-2'>
                {Array.from({length: 5}).map((_, i) => (
                  <div key={i} className='flex items-center gap-2 
                  text-white px-3 py-1 rounded-lg bg-secondary'>
                    <TagIcon size={15}/>
                    <h3 className='text-sm'>
                      Tag {i+1}
                    </h3>
                  </div>
                ))}
              </div>
              <div className='bg-gradient-to-r from-main to-mainDarker
              p-5 rounded-xl flex flex-col gap-4'>
                <div className='flex items-center gap-2'>
                  <Pencil size={18}/>
                  <span className='font-medium'>AI Analysis</span>
                </div>
                <p className='text-sm'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, voluptate.
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum tempore voluptatem fugit blanditiis repellendus aspernatur, sunt quod, quia accusantium architecto aut consequatur dicta. Odio ab similique at, nihil sunt minus?
                </p>
              </div>
            </div>
            <div className='w-full h-[25rem] relative rounded-xl shadow-lg'>
              <CldImage
                alt="Sample image"
                src="cld-sample-2"
                fill
                crop={{
                  type: 'auto',
                  source: true
                }}
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className='mt-16 mb-20'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>
              About This Event
            </h2>
            <div>
              {/* Main Bio Content */}
              <div className='space-y-4'>
                <p className='text-gray-700 leading-relaxed'>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ducimus, architecto fuga hic dolores voluptates dolore esse officiis qui facilis quibusdam tenetur amet facere obcaecati neque autem? Harum, provident et.
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque veniam ex odio laudantium velit mollitia eveniet id eligendi in sit nemo, aut quisquam sunt fuga accusantium voluptates! Alias, nulla accusantium!
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet quasi aperiam consequatur obcaecati similique iste iure, nisi dolore, voluptate autem perferendis necessitatibus, veritatis quam inventore expedita eaque rerum minima consectetur!
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellendus doloremque quidem tempore accusamus earum error quam cumque ab ipsa aspernatur recusandae, consequatur exercitationem, nemo amet? Nesciunt veritatis vitae dolorem voluptates.  
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates dolore eligendi neque quae reprehenderit. Officia dicta omnis, architecto tempore quam et. Vel incidunt, minima iste similique quibusdam iusto facilis provident.
                  Vitae aliquam eligendi asperiores libero cupiditate fuga? Eveniet nam eaque dolorem ipsam magnam soluta error, ad fugiat accusantium recusandae dolore quas molestiae ut tempore sed veritatis incidunt unde perspiciatis officia.
                  Libero voluptate obcaecati possimus iste placeat! Nihil, consectetur assumenda. Repellat nemo modi accusamus, cupiditate nobis laborum minus odio culpa rem sit ratione architecto qui, expedita dolorem ipsa rerum. Sit, asperiores!
                  Dolores, eligendi incidunt dolorum voluptas quidem omnis! Rerum voluptatum id odit dolor soluta delectus quasi molestiae odio, quia laborum, reprehenderit quo vero eos sequi sunt? Ducimus, alias! Veniam, cumque repellendus!
                  Corrupti eos ullam, ipsum saepe debitis numquam? Mollitia illo sit cum possimus ipsa eius voluptas quos, quas, aperiam laudantium minus culpa cupiditate aspernatur rerum aliquid facere iste ducimus nam obcaecati.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Tickets section */}
        <TicketSection />
      </main>
    </div>
  )
}