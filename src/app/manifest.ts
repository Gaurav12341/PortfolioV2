import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gaurav Raj - Portfolio',
    short_name: 'Gaurav Raj',
    description: 'Backend Software Engineer building distributed systems and cloud platforms, with hands-on experience shipping production AI/RAG systems.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0a0d',
    theme_color: '#0b0a0d',
    icons: [
      {
        src: '/icon',
        sizes: '64x64',
        type: 'image/png',
      },
    ],
  }
}
