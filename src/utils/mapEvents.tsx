import { eventbus } from "./eventBus"


export const mapEventChannel = eventbus<{
  onAdd3D: (payload: any) => void
  onRemove3D: (payload: any) => void
}>()