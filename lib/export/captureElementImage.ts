import html2canvas from 'html2canvas'

type StyleSnapshot = {
  className: string
  style: string
}

function resolveImageSrc(src: string): string {
  try {
    return new URL(src, window.location.href).href
  } catch {
    return src
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Could not read image data'))
    }
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image data'))
    reader.readAsDataURL(blob)
  })
}

async function inlineImagesForCapture(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'))

  await Promise.all(
    images.map(async (image) => {
      const src = image.getAttribute('src')
      if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
        return
      }

      const response = await fetch(resolveImageSrc(src))
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${src}`)
      }

      const blob = await response.blob()
      image.src = await blobToDataUrl(blob)
      image.removeAttribute('crossorigin')
    }),
  )
}

function positionElementForCapture(element: HTMLElement): () => void {
  const previous = element.getAttribute('style') ?? ''

  element.style.position = 'fixed'
  element.style.left = '0'
  element.style.top = '0'
  element.style.zIndex = '-1'
  element.style.opacity = '1'
  element.style.visibility = 'visible'
  element.style.pointerEvents = 'none'

  return () => {
    if (previous) {
      element.setAttribute('style', previous)
      return
    }

    element.removeAttribute('style')
  }
}

function applyComputedStyles(node: HTMLElement): void {
  const computed = window.getComputedStyle(node)

  node.style.animation = 'none'
  node.style.transition = 'none'
  node.style.boxShadow = 'none'
  node.style.filter = 'none'
  node.style.backdropFilter = 'none'
  node.style.color = computed.color
  node.style.backgroundColor = computed.backgroundColor
  node.style.backgroundImage = 'none'
  node.style.borderColor = computed.borderColor
  node.style.borderWidth = computed.borderWidth
  node.style.borderStyle = computed.borderStyle
  node.style.fontFamily = computed.fontFamily
  node.style.fontSize = computed.fontSize
  node.style.fontWeight = computed.fontWeight
  node.style.fontStyle = computed.fontStyle
  node.style.textAlign = computed.textAlign
  node.style.lineHeight = computed.lineHeight
  node.style.transform = computed.transform
  node.style.padding = computed.padding
  node.style.margin = computed.margin
  node.style.borderRadius = computed.borderRadius
  node.style.opacity = computed.opacity
  node.style.display = computed.display
  node.style.width = computed.width
  node.style.height = computed.height
  node.style.maxWidth = computed.maxWidth
  node.style.objectFit = computed.objectFit
}

function flattenStylesForCapture(root: HTMLElement): () => void {
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]
  const snapshots = new Map<HTMLElement, StyleSnapshot>()

  nodes.forEach((node) => {
    snapshots.set(node, {
      className: node.className,
      style: node.getAttribute('style') ?? '',
    })
    node.removeAttribute('class')
    applyComputedStyles(node)
  })

  root.style.backgroundColor = '#fff8f0'

  return () => {
    snapshots.forEach((snapshot, node) => {
      node.className = snapshot.className
      if (snapshot.style) {
        node.setAttribute('style', snapshot.style)
        return
      }

      node.removeAttribute('style')
    })
  }
}

function stripCloneStylesheets(clonedDoc: Document): void {
  clonedDoc.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    node.remove()
  })
}

async function renderCaptureCanvas(
  element: HTMLElement,
  html2canvasImpl: typeof html2canvas,
): Promise<HTMLCanvasElement> {
  const baseOptions = {
    backgroundColor: '#fff8f0',
    scale: 2,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc: Document) => {
      stripCloneStylesheets(clonedDoc)
    },
  } as const

  try {
    return await html2canvasImpl(element, {
      ...baseOptions,
      useCORS: false,
      allowTaint: false,
    })
  } catch {
    return await html2canvasImpl(element, {
      ...baseOptions,
      useCORS: false,
      allowTaint: true,
    })
  }
}

function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

export async function captureElementImage(element: HTMLElement): Promise<Blob> {
  if (element.offsetWidth === 0 || element.offsetHeight === 0) {
    throw new Error('Export snapshot has no visible size')
  }

  await document.fonts.ready
  await inlineImagesForCapture(element)

  const restorePosition = positionElementForCapture(element)
  const restoreStyles = flattenStylesForCapture(element)

  try {
    await waitForNextFrame()

    const canvas = await renderCaptureCanvas(element, html2canvas)

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Capture produced an empty image')
    }

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), 'image/png', 1)
    })

    if (!blob) {
      throw new Error('Could not encode image')
    }

    return blob
  } finally {
    restoreStyles()
    restorePosition()
  }
}
