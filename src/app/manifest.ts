import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gaurav Raj - Portfolio',
    short_name: 'Gaurav Raj',
    description: 'Backend Software Engineer building distributed systems and cloud platforms, with hands-on experience shipping production AI/RAG systems.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/md-red-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
