export interface Client {
    id: string
    name: string
    document: string
    birthDate: string | null
    phone: string | null
    email: string | null
    street: string | null
    number: string | null
    complement: string | null
    neighborhood: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    documents: string[]
    indicatedById: string | null
    indicatedBy?: Client | null
    indications?: Client[]
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  