import { create } from 'zustand'
import { persist } from 'zustand/middleware'





interface City {
  id: string
  city: {
    name: string
    country: string
    lat: number
    lon: number
  }
  order: number
  pinned: boolean
}






interface WeatherState {
  cities: City[]
  unit: 'metric' | 'imperial'
  selectedCityId: string | null
  
  addCity: (city: { name: string; country: string; lat: number; lon: number; pinned?: boolean }) => void
  removeCity: (id: string) => void
  togglePin: (id: string) => void
  setSelectedCityId: (id: string) => void
  setUnit: (unit: 'metric' | 'imperial') => void
  reorderCities: (fromIndex: number, toIndex: number) => void
}







export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      cities: [],
      unit: 'metric',
      selectedCityId: null,

      addCity: (cityData) => {
        const { cities } = get()
        const newCity: City = {
          id: `${Date.now()}-${Math.random()}`,
          city: cityData,
          order: cities.length,
          pinned: cityData.pinned || false,
        }
        
        set((state) => ({
          cities: [...state.cities, newCity],
          selectedCityId: state.selectedCityId || newCity.id
        }))
      },

      removeCity: (id) => {
        const { cities, selectedCityId } = get()
        const newCities = cities.filter(city => city.id !== id)
        
        set((state) => ({
          cities: newCities,
          selectedCityId: selectedCityId === id 
            ? (newCities.length > 0 ? newCities[0].id : null)
            : selectedCityId
        }))
      },

      togglePin: (id) => {
        set((state) => ({
          cities: state.cities.map(city => 
            city.id === id 
              ? { ...city, pinned: !city.pinned }
              : city
          )
        }))
      },

      setSelectedCityId: (id) => {
        set({ selectedCityId: id })
      },

      setUnit: (unit) => {
        set({ unit })
      },

      reorderCities: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newCities = [...state.cities]
          const [movedCity] = newCities.splice(fromIndex, 1)
          newCities.splice(toIndex, 0, movedCity)
          
          return {
            cities: newCities.map((city, index) => ({
              ...city,
              order: index
            }))
          }
        })
      },
    }),
    {
      name: 'weather-storage',
      partialize: (state) => ({ 
        cities: state.cities, 
        unit: state.unit,
        selectedCityId: state.selectedCityId
      }),
    }
  )
)
