<!-- Ilustración de InstalarAppModal: reproduce en pequeño el menú de Safari (Mac), la hoja
     Compartir (iPhone/iPad), la barra de Chrome/Edge o el menú del navegador en Android, y resalta en el color del rol lo que hay que pulsar en cada paso.
     Dibujada en HTML y no con capturas: no se queda vieja con cada versión de macOS/iOS ni
     depende del idioma o del modo oscuro del equipo. Decorativa (aria-hidden): los pasos en
     texto están en el modal. -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  plataforma: { type: String, required: true }, // 'safari-mac' | 'ios' | 'chrome' | 'chrome-android' | 'firefox-android'
  paso:       { type: Number, required: true },  // 0, 1, 2
})

// Opción del menú de Android que hay que pulsar: Firefox la llama «Instalar»
const opcionAndroid = computed(() =>
  props.plataforma === 'firefox-android' ? 'Instalar' : 'Añadir a pantalla de inicio')
const MENU_ANDROID = computed(() => ['Nueva pestaña', 'Historial', 'Descargas', 'Compartir…', opcionAndroid.value])

const MENU_MAC = ['Safari', 'Archivo', 'Edición', 'Visualización', 'Historial']
const ARCHIVO_MAC = ['Nueva ventana', 'Nueva pestaña', 'Abrir archivo…', '—', 'Compartir', 'Añadir al Dock…', '—', 'Exportar como PDF…']
const COMPARTIR_IOS = ['Copiar', 'Añadir a la lista de lectura', 'Añadir a favoritos', 'Añadir a pantalla de inicio']
</script>

<template>
  <div aria-hidden="true"
       class="relative h-44 select-none overflow-hidden rounded-2xl border border-borde bg-gradient-to-br from-[#E9EEF5] to-[#D9E1EA] sm:h-48">

    <!-- ═══ Safari en Mac ═══ -->
    <template v-if="plataforma === 'safari-mac'">
      <!-- Barra de menús -->
      <div class="flex h-7 items-center gap-3 bg-white/80 px-3 text-[11px] text-azul-noche backdrop-blur sm:gap-4">
        <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/></svg>
        <!-- La barra completa mide ~390px: con el modal estrecho (< sm) se quitan los dos últimos
             menús para que no queden cortados; «Archivo», el que importa, se ve siempre -->
        <span v-for="item in MENU_MAC" :key="item"
              class="relative whitespace-nowrap rounded px-1.5 py-0.5 transition-colors duration-300"
              :class="[
                item === 'Visualización' || item === 'Historial' ? 'hidden sm:inline' : '',
                item === 'Safari' ? 'font-bold' : '',
                item === 'Archivo' && paso === 1 ? 'bg-rol text-white' : '',
                item === 'Archivo' && paso === 0 ? 'ring-2 ring-rol ring-offset-1 animate-pulse' : '',
              ]">{{ item }}</span>
      </div>

      <!-- Menú Archivo desplegado -->
      <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1"
                  leave-active-class="transition duration-150" leave-to-class="opacity-0">
        <div v-if="paso === 1"
             class="absolute left-[4.6rem] top-7 z-10 w-44 rounded-lg border border-black/10 bg-white/95 py-1 text-[11px] text-azul-noche shadow-xl sm:left-[5.2rem]">
          <template v-for="(item, i) in ARCHIVO_MAC" :key="i">
            <div v-if="item === '—'" class="my-1 h-px bg-black/10" />
            <div v-else class="mx-1 rounded px-2 py-0.5"
                 :class="item === 'Añadir al Dock…' ? 'bg-rol font-semibold text-white ring-2 ring-rol/40 animate-pulse' : ''">
              {{ item }}
            </div>
          </template>
        </div>
      </Transition>

      <!-- Diálogo "Añadir al Dock" -->
      <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 scale-95"
                  leave-active-class="transition duration-150" leave-to-class="opacity-0">
        <div v-if="paso === 2"
             class="absolute inset-x-0 top-9 z-10 mx-auto w-[min(17rem,calc(100%-1.5rem))] rounded-xl border border-black/10 bg-white/95 p-3 text-[11px] text-azul-noche shadow-xl">
          <p class="font-semibold">Añadir al Dock</p>
          <div class="mt-2 flex items-center gap-2">
            <img src="/pwa-192x192.png" alt="" class="h-9 w-9 shrink-0" />
            <div class="min-w-0 flex-1">
              <div class="rounded border border-borde px-1.5 py-0.5">DuaLab</div>
              <p class="mt-0.5 truncate text-[10px] text-texto-secundario">dualab.es</p>
            </div>
          </div>
          <div class="mt-3 flex justify-end gap-2">
            <span class="rounded-full border border-borde px-2.5 py-0.5">Cancelar</span>
            <span class="rounded-full bg-rol px-3 py-0.5 font-semibold text-white ring-2 ring-rol/40 ring-offset-1 animate-pulse">Añadir</span>
          </div>
        </div>
      </Transition>

      <!-- Dock (al fondo): el icono aparece al terminar -->
      <div class="absolute inset-x-0 bottom-2 mx-auto flex w-fit items-end gap-1.5 rounded-xl border border-white/60 bg-white/50 px-2 py-1.5 backdrop-blur">
        <span v-for="c in ['bg-[#4A90D9]', 'bg-[#E5E7EB]', 'bg-[#34C759]']" :key="c" class="h-6 w-6 rounded-md" :class="c" />
        <img src="/pwa-192x192.png" alt="" class="h-6 w-6 rounded-md bg-white transition-all duration-500"
             :class="paso === 2 ? 'scale-110 opacity-100' : 'scale-50 opacity-0'" />
      </div>
    </template>

    <!-- ═══ Chrome / Edge en ordenador ═══ -->
    <template v-else-if="plataforma === 'chrome'">
      <div class="absolute inset-x-3 top-3 bottom-12 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg sm:inset-x-6">
        <!-- Pestaña + barra de direcciones (en el paso 3, ventana propia sin barra) -->
        <div v-if="paso < 2" class="flex items-center gap-1.5 bg-[#EEF1F5] px-2 pt-1.5">
          <span class="flex items-center gap-1 rounded-t-md bg-white px-2 py-1 text-[10px] text-azul-noche">
            <img src="/favicon.png" alt="" class="h-3 w-3" /> DuaLab
          </span>
        </div>
        <div v-if="paso < 2" class="flex items-center gap-2 border-b border-black/5 px-2 py-1.5">
          <div class="flex min-w-0 flex-1 items-center justify-between rounded-full bg-[#EEF1F5] py-1 pl-3 pr-1 text-[10px] text-texto-secundario">
            <span class="truncate">dualab.es/login</span>
            <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors"
                  :class="paso === 0 ? 'bg-rol text-white ring-2 ring-rol/40 ring-offset-1 animate-pulse' : 'text-azul-noche/60'">
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 8v5m0 0l-2-2m2 2l2-2M8 20h8"/></svg>
            </span>
          </div>
          <span class="text-xs font-bold leading-none text-azul-noche/60">⋮</span>
        </div>
        <div v-else class="flex items-center gap-1.5 border-b border-black/5 bg-azul-noche px-2 py-1.5 text-[10px] font-semibold text-white">
          <img src="/favicon.png" alt="" class="h-3 w-3" /> DuaLab
        </div>
        <div class="space-y-1.5 p-3">
          <div class="h-2 w-24 rounded-full bg-borde" />
          <div class="h-2 w-36 rounded-full bg-borde/70" />
        </div>

      </div>

      <!-- Diálogo "¿Instalar app?" bajo la barra (fuera de la ventana: no lo recorta) -->
      <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1"
                  leave-active-class="transition duration-150" leave-to-class="opacity-0">
        <div v-if="paso === 1"
             class="absolute right-5 top-[3.4rem] z-10 w-[min(15rem,calc(100%-2rem))] sm:right-8 rounded-xl border border-black/10 bg-white p-3 text-[11px] text-azul-noche shadow-xl">
          <p class="font-semibold">¿Instalar app?</p>
          <div class="mt-2 flex items-center gap-2">
            <img src="/pwa-192x192.png" alt="" class="h-8 w-8 shrink-0" />
            <div class="min-w-0">
              <p class="font-semibold">DuaLab</p>
              <p class="truncate text-[10px] text-texto-secundario">dualab.es</p>
            </div>
          </div>
          <div class="mt-3 flex justify-end gap-2">
            <span class="rounded-full border border-borde px-2.5 py-0.5">Cancelar</span>
            <span class="rounded-full bg-rol px-3 py-0.5 font-semibold text-white ring-2 ring-rol/40 ring-offset-1 animate-pulse">Instalar</span>
          </div>
        </div>
      </Transition>

      <!-- Barra de tareas / Dock: el icono aparece al terminar -->
      <div class="absolute inset-x-0 bottom-2 mx-auto flex w-fit items-end gap-1.5 rounded-xl border border-white/60 bg-white/50 px-2 py-1.5 backdrop-blur">
        <span v-for="c in ['bg-[#4A90D9]', 'bg-[#E5E7EB]', 'bg-[#34C759]']" :key="c" class="h-6 w-6 rounded-md" :class="c" />
        <img src="/pwa-192x192.png" alt="" class="h-6 w-6 rounded-md bg-white transition-all duration-500"
             :class="paso === 2 ? 'scale-110 opacity-100' : 'scale-50 opacity-0'" />
      </div>
    </template>

    <!-- ═══ Android (Chrome, Edge, Samsung Internet, Firefox) ═══ -->
    <template v-else-if="plataforma === 'chrome-android' || plataforma === 'firefox-android'">
      <div class="absolute inset-x-0 bottom-0 top-3 mx-auto flex w-52 flex-col overflow-hidden rounded-t-[1.6rem] border-4 border-b-0 border-azul-noche bg-white sm:w-56">
        <!-- Barra de direcciones con el menú ⋮ -->
        <div class="flex items-center gap-2 border-b border-black/5 px-2 py-1.5">
          <div class="min-w-0 flex-1 truncate rounded-full bg-[#EEF1F5] px-2.5 py-1 text-[10px] text-texto-secundario">dualab.es/login</div>
          <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold leading-none transition-colors"
                :class="paso === 0 ? 'bg-rol text-white ring-2 ring-rol/40 ring-offset-1 animate-pulse' : 'text-azul-noche/60'">⋮</span>
        </div>
        <div class="flex-1 bg-[#F4F7FA] p-2">
          <div class="h-2 w-16 rounded-full bg-borde" />
          <div class="mt-2 h-10 rounded-lg bg-white" />
        </div>

        <!-- Menú del navegador -->
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1"
                    leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <div v-if="paso === 1"
               class="absolute right-1 top-8 z-10 w-40 rounded-lg border border-black/10 bg-white py-1 text-[10px] text-azul-noche shadow-xl">
            <div v-for="item in MENU_ANDROID" :key="item" class="mx-1 truncate rounded px-2 py-1"
                 :class="item === opcionAndroid ? 'bg-rol font-semibold text-white ring-2 ring-rol/40 animate-pulse' : ''">
              {{ item }}
            </div>
          </div>
        </Transition>

        <!-- Confirmación "Instalar" -->
        <Transition enter-active-class="transition duration-200" enter-from-class="translate-y-full"
                    leave-active-class="transition duration-150" leave-to-class="translate-y-full">
          <div v-if="paso === 2" class="absolute inset-x-0 bottom-0 rounded-t-xl bg-white p-3 text-[10px] text-azul-noche shadow-[0_-8px_24px_rgba(0,0,0,0.15)]">
            <p class="font-semibold">Instalar app</p>
            <div class="mt-2 flex items-center gap-2">
              <img src="/pwa-192x192.png" alt="" class="h-8 w-8 shrink-0" />
              <span class="min-w-0 flex-1 truncate font-semibold">DuaLab</span>
            </div>
            <div class="mt-2 flex justify-end gap-2">
              <span class="rounded-full border border-borde px-2.5 py-0.5">Cancelar</span>
              <span class="rounded-full bg-rol px-3 py-0.5 font-semibold text-white ring-2 ring-rol/40 ring-offset-1 animate-pulse">Instalar</span>
            </div>
          </div>
        </Transition>
      </div>
    </template>

    <!-- ═══ Safari en iPhone / iPad ═══ -->
    <template v-else>
      <div class="absolute inset-x-0 bottom-0 top-3 mx-auto flex w-52 flex-col overflow-hidden rounded-t-[1.6rem] border-4 border-b-0 border-azul-noche bg-white sm:w-56">
        <div class="flex-1 bg-[#F4F7FA] p-2">
          <div class="h-2 w-16 rounded-full bg-borde" />
          <div class="mt-2 h-10 rounded-lg bg-white" />
        </div>

        <!-- Hoja Compartir -->
        <Transition enter-active-class="transition duration-200" enter-from-class="translate-y-full"
                    leave-active-class="transition duration-150" leave-to-class="translate-y-full">
          <div v-if="paso >= 1" class="absolute inset-x-0 bottom-0 rounded-t-xl bg-white px-2 pb-2 pt-2 text-[10px] text-azul-noche shadow-[0_-8px_24px_rgba(0,0,0,0.15)]">
            <template v-if="paso === 1">
              <div v-for="item in COMPARTIR_IOS" :key="item"
                   class="flex items-center justify-between rounded-md px-2 py-1"
                   :class="item === 'Añadir a pantalla de inicio' ? 'bg-rol font-semibold text-white ring-2 ring-rol/40 animate-pulse' : 'border-b border-black/5'">
                <span class="truncate">{{ item }}</span>
                <svg v-if="item === 'Añadir a pantalla de inicio'" class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center justify-between gap-1 whitespace-nowrap px-1">
                <span class="text-texto-secundario">Cancelar</span>
                <span class="font-semibold">Añadir a inicio</span>
                <span class="rounded-full bg-rol px-2 py-0.5 font-semibold text-white ring-2 ring-rol/40 animate-pulse">Añadir</span>
              </div>
              <div class="mt-2 flex items-center gap-2 px-1">
                <img src="/apple-touch-icon.png" alt="" class="h-8 w-8 shrink-0 rounded-lg border border-black/5" />
                <span class="rounded border border-borde px-1.5 py-0.5">DuaLab</span>
              </div>
            </template>
          </div>
        </Transition>

        <!-- Barra inferior de Safari con el botón Compartir -->
        <div v-if="paso === 0" class="flex h-9 items-center justify-around border-t border-black/5 bg-white/95 px-2 pb-1 text-azul-noche/70">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rol text-white ring-2 ring-rol/40 ring-offset-1 animate-pulse">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15V3m0 0L8 7m4-4l4 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
          </span>
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5z"/></svg>
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .animate-pulse { animation: none; }
}
</style>
