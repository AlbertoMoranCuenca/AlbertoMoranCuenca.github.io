import type { TechnologiesSelector } from "@components/TecnologiesScroller.astro"

export interface Project {
  name?: string,
  images?: string[],
  description?: string
  techs?: TechnologiesSelector
  isPrivate?: boolean
}

export const ProjectsData: Project[] = [
  {
    name: "BUSINESS HUB - MDA",
    description: "Business Hub is the core management platform for 'Montes del Acebo' a poultry processing and distribution company. It provides full traceability of food products from origin to transformation and final destination, ensuring compliance with quality and safety standards. This system allows seamless tracking of every step in the supply chain, while also integrating invoice management and providing a centralized solution for handling product, customer, and supplier information. The platform empowers the company to maintain control and visibility over their entire production and distribution process, streamlining operations and enhancing transparency.",
    isPrivate: true,
    images: [
      "/projects/mda/trace-map.png",
      "/projects/mda/login.png",
      "/projects/mda/import-products.png",
      "/projects/mda/do-purchase.png",
      "/projects/mda/inventory.png",
      "/projects/mda/purchase.png",
      "/projects/mda/do-cut.png",
      "/projects/mda/cut.png",
      "/projects/mda/do-sale.png",
      "/projects/mda/sale.png",
      "/projects/mda/update-supplier.png",
    ],
    techs: {
      springboot: true,
      angular: true,
      postgresql: true,
      docker: true,
      jenkins: true,
      java: true,
      html: true,
      ts: true,
      sass: true,
      aws: true,

    }
  },
  
]  