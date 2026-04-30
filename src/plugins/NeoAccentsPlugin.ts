import { Config, Plugin, Field } from 'payload'
import { normalizeNeoText } from '@/utilities/normalizeNeoText'

/**
 * Utility per convertire caratteri accentati non supportati dal font Neo
 * in combinazioni di lettera + apostrofo.
 */
export const formatNeoAccents = (value: any) => {
  return normalizeNeoText(value)
}

/**
 * Funzione ricorsiva per aggiungere il hook di formattazione a tutti i campi di testo
 */
const addHookToFields = (fields: Field[]): Field[] => {
  return fields.map((field) => {
    // Se il campo è di tipo testo/textarea, aggiungiamo il hook
    if (field.type === 'text' || field.type === 'textarea') {
      const existingHooks = field.hooks?.beforeChange || []
      return {
        ...field,
        hooks: {
          ...field.hooks,
          beforeChange: [
            ...existingHooks,
            ({ value }) => formatNeoAccents(value),
          ],
        },
      }
    }

    // Se ha sotto-campi (group, row, array, etc.), processiamoli ricorsivamente
    if ('fields' in field && Array.isArray(field.fields)) {
      return {
        ...field,
        fields: addHookToFields(field.fields),
      }
    }

    // Se è un campo blocks, processiamo i campi di ogni blocco
    if (field.type === 'blocks' && Array.isArray(field.blocks)) {
      return {
        ...field,
        blocks: field.blocks.map((block) => ({
          ...block,
          fields: addHookToFields(block.fields),
        })),
      }
    }

    return field
  })
}

/**
 * Plugin per Payload che garantisce la compatibilità dei testi con il font Neo
 * convertendo automaticamente gli accenti in apostrofi durante il salvataggio.
 */
export const neoAccentsPlugin: Plugin = (config: Config): Config => {
  const processedConfig: Config = {
    ...config,
    collections: config.collections?.map((collection) => ({
      ...collection,
      fields: addHookToFields(collection.fields),
    })),
    globals: config.globals?.map((global) => ({
      ...global,
      fields: addHookToFields(global.fields),
    })),
  }

  return processedConfig
}
