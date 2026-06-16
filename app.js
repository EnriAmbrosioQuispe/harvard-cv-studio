document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // DOM ELEMENT REFERENCES
  // ==========================================================================
  const editor = document.getElementById('markdown-editor');
  const preview = document.getElementById('cv-preview');
  const defaultContent = document.getElementById('default-markdown-content');
  
  // Format Sliders & Selects
  const selectFont = document.getElementById('select-font');
  const sliderFontSize = document.getElementById('slider-fontSize');
  const sliderMargins = document.getElementById('slider-margins');
  const sliderLineHeight = document.getElementById('slider-lineHeight');
  const sliderSectionSpace = document.getElementById('slider-sectionSpace');
  const checkPageBreaks = document.getElementById('check-pagebreaks');
  
  // Text Labels for Sliders
  const fontVal = document.getElementById('font-val');
  const fontSizeVal = document.getElementById('fontSize-val');
  const marginsVal = document.getElementById('margins-val');
  const lineHeightVal = document.getElementById('lineHeight-val');
  const sectionSpaceVal = document.getElementById('sectionSpace-val');
  
  // Toolbar Buttons
  const btnImport = document.getElementById('btn-import');
  const fileInput = document.getElementById('file-input');
  const btnExportMd = document.getElementById('btn-export-md');
  const btnPrint = document.getElementById('btn-print');
  const btnTogglePreview = document.getElementById('btn-toggle-preview-only');
  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const sidebar = document.querySelector('.sidebar');
  const appContainer = document.querySelector('.app-container');
  
  // Word Count & ATS Elements
  const wordCountLabel = document.getElementById('word-count');
  const scoreNum = document.getElementById('ats-score-num');
  const scoreBar = document.getElementById('score-bar');
  const checklistElement = document.getElementById('ats-checklist');
  
  // Page Break Lines
  const breakLine1 = document.getElementById('page-break-line-1');
  const breakLine2 = document.getElementById('page-break-line-2');
  const paperContainer = document.querySelector('.paper-container');

  // ==========================================================================
  // CONFIGURATION & DEFAULTS
  // ==========================================================================
  // Pre-load default CV from template textarea
  editor.value = defaultContent.value;

  // Initialize marked options (version-agnostic)
  if (typeof marked.use === 'function') {
    marked.use({ breaks: true, gfm: true });
  } else if (typeof marked.setOptions === 'function') {
    marked.setOptions({ breaks: true, gfm: true });
  }

  // Action verbs list (Spanish) for ATS checker
  const ACTION_VERBS = [
    'lideré', 'lidero', 'elaboré', 'elaboro', 'diseñé', 'diseño', 'implementé', 'implemento',
    'desarrollé', 'desarrollo', 'coordiné', 'coordino', 'gestioné', 'gestiono', 'integré', 'integro',
    'creé', 'creo', 'dirigí', 'dirijo', 'optimisé', 'optimizo', 'planifiqué', 'planifico',
    'evalúe', 'evalúo', 'analicé', 'analizo', 'programé', 'programo', 'automaticé', 'automatizo',
    'reduje', 'reduzco', 'incrementé', 'incremento', 'mejoré', 'mejoro', 'participé', 'participo',
    'explico', 'expliqué', 'introduzco', 'introduje', 'dicté', 'dicto'
  ];

  // ==========================================================================
  // PARSING & HTML RESTRUCTURING (HARVARD LAYOUT RULES)
  // ==========================================================================
  function parseAndRenderCV(markdownText) {
    // 1. Convert basic markdown to HTML via marked.js
    let rawHtml = marked.parse(markdownText);
    
    // 2. Parse HTML into DOM elements for custom restructuring
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = rawHtml;
    
    // 3. Process H1 Elements (Name Header & Section Dividers)
    const h1Elements = Array.from(tempContainer.querySelectorAll('h1'));
    h1Elements.forEach((h1, index) => {
      if (index === 0) {
        // Name & contact block (First H1 in CV)
        const header = document.createElement('header');
        header.className = 'cv-header';
        
        const nameNode = document.createElement('h1');
        nameNode.innerHTML = h1.innerHTML;
        header.appendChild(nameNode);
        
        // Look for immediate next sibling which holds contact details
        const nextSibling = h1.nextElementSibling;
        if (nextSibling && nextSibling.tagName === 'P') {
          const contactNode = document.createElement('p');
          contactNode.className = 'cv-contact-para';
          contactNode.innerHTML = nextSibling.innerHTML;
          header.appendChild(contactNode);
          nextSibling.remove(); // Remove original raw paragraph
        }
        
        h1.replaceWith(header);
      } else {
        // Main Sections (Perfil, Experiencia Laboral, Educación, Habilidades, etc.)
        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'section-title';
        sectionTitle.innerHTML = h1.innerHTML;
        h1.replaceWith(sectionTitle);
      }
    });

    // 4. Process H2 Elements and Metadata Lines (Jobs & Education blocks)
    const h2Elements = Array.from(tempContainer.querySelectorAll('h2'));
    h2Elements.forEach(h2 => {
      const nextSibling = h2.nextElementSibling;
      if (nextSibling && nextSibling.tagName === 'P') {
        const pText = nextSibling.textContent || '';
        
        // Identify Harvard metadata line containing company, dates and location
        if (pText.includes('|')) {
          const parts = nextSibling.innerHTML.split('|').map(p => p.trim());
          
          let subtitleLeft = parts[0] || ''; // Company or Degree
          let datePart = '';
          let locationPart = '';
          
          // Regex to check if a string looks like dates (has years, months, or "Actualidad")
          const dateRegex = /\b(19|20)\d{2}\b|actualidad|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i;
          
          if (parts.length >= 3) {
            if (dateRegex.test(parts[1])) {
              datePart = parts[1];
              locationPart = parts[2];
            } else {
              locationPart = parts[1];
              datePart = parts[2];
            }
          } else if (parts.length === 2) {
            if (dateRegex.test(parts[1])) {
              datePart = parts[1];
            } else {
              locationPart = parts[1];
            }
          }
          
          // Construct the beautiful double-line Harvard flex grid
          const jobBlock = document.createElement('div');
          jobBlock.className = 'job-block';
          
          // Line 1: Job Title / School Name (Left) | Dates (Right)
          const line1 = document.createElement('div');
          line1.className = 'job-line job-line-1';
          
          const titleSpan = document.createElement('span');
          titleSpan.className = 'job-title-text';
          titleSpan.innerHTML = h2.innerHTML;
          
          const dateSpan = document.createElement('span');
          dateSpan.className = 'job-dates-text';
          dateSpan.innerHTML = datePart;
          
          line1.appendChild(titleSpan);
          line1.appendChild(dateSpan);
          
          // Line 2: Company / Degree (Left, Italic) | Location (Right, Italic)
          const line2 = document.createElement('div');
          line2.className = 'job-line job-line-2';
          
          const subtitleSpan = document.createElement('span');
          subtitleSpan.className = 'job-company-text';
          subtitleSpan.innerHTML = subtitleLeft;
          
          const locationSpan = document.createElement('span');
          locationSpan.className = 'job-location-text';
          locationSpan.innerHTML = locationPart;
          
          line2.appendChild(subtitleSpan);
          line2.appendChild(locationSpan);
          
          jobBlock.appendChild(line1);
          jobBlock.appendChild(line2);
          
          // Replace headers in the final DOM stream
          h2.replaceWith(jobBlock);
          nextSibling.remove();
        }
      }
    });

    // 5. Update Preview DOM
    preview.innerHTML = tempContainer.innerHTML;
    
    // 6. Refresh Layout & Page Breaks
    setTimeout(updatePageBreaks, 50);
  }

  // ==========================================================================
  // REAL-TIME ATS SCORE CARD & METRICS
  // ==========================================================================
  function runATSCheck(markdownText) {
    const textLower = markdownText.toLowerCase();
    let score = 0;
    const items = [];

    // 1. Check for LinkedIn link
    const hasLinkedIn = /linkedin\.com\b/.test(textLower);
    if (hasLinkedIn) {
      score += 10;
      items.push({ text: 'Enlace a LinkedIn detectado', status: 'passed' });
    } else {
      items.push({ text: 'Falta enlace a LinkedIn profesional', status: 'failed' });
    }

    // 2. Check for contact details: Email and Phone
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(textLower);
    const hasPhone = /(\+?\d[\d -]{7,15}\d)/.test(textLower);
    
    if (hasEmail && hasPhone) {
      score += 15;
      items.push({ text: 'Contacto completo (Email y Teléfono)', status: 'passed' });
    } else if (hasEmail || hasPhone) {
      score += 5;
      items.push({ text: 'Falta email o teléfono en contacto', status: 'warning' });
    } else {
      items.push({ text: 'Falta email y teléfono', status: 'failed' });
    }

    // 3. Check for main section headers
    const hasEducation = /#\s+educaci[óo]n\b|#\s+education\b/.test(textLower);
    if (hasEducation) {
      score += 15;
      items.push({ text: 'Sección de Educación bien definida', status: 'passed' });
    } else {
      items.push({ text: 'Falta sección de Educación (# Educación)', status: 'failed' });
    }

    const hasExperience = /#\s+experiencia\s+laboral\b|#\s+experience\b|#\s+experiencia\b/.test(textLower);
    if (hasExperience) {
      score += 15;
      items.push({ text: 'Sección de Experiencia bien definida', status: 'passed' });
    } else {
      items.push({ text: 'Falta sección de Experiencia (# Experiencia)', status: 'failed' });
    }

    const hasSkills = /#\s+herramientas\b|#\s+tecnolog[íi]as\b|#\s+habilidades\b|#\s+skills\b/.test(textLower);
    if (hasSkills) {
      score += 10;
      items.push({ text: 'Sección de Habilidades/Herramientas estructurada', status: 'passed' });
    } else {
      items.push({ text: 'Falta sección de Habilidades/Herramientas', status: 'failed' });
    }

    // 4. Ensure no complex layout elements like Markdown Tables (ATS killers)
    const hasTables = /\|.*\|/.test(textLower) && textLower.includes('-|-');
    if (!hasTables) {
      score += 10;
      items.push({ text: 'Estructura lineal sin tablas (Óptimo para ATS)', status: 'passed' });
    } else {
      items.push({ text: 'Contiene tablas (Peligro de lectura en ATS)', status: 'failed' });
    }

    // 5. Strong Action Verbs counter
    let verbCount = 0;
    const foundVerbs = [];
    ACTION_VERBS.forEach(verb => {
      const regex = new RegExp('\\b' + verb + '\\b', 'gi');
      const matches = markdownText.match(regex);
      if (matches) {
        verbCount += matches.length;
        if (!foundVerbs.includes(verb)) foundVerbs.push(verb);
      }
    });

    if (verbCount >= 8) {
      score += 15;
      items.push({ text: `Excelente uso de verbos de acción (${foundVerbs.length} únicos)`, status: 'passed' });
    } else if (verbCount >= 3) {
      score += 8;
      items.push({ text: `Uso regular de verbos de acción (${foundVerbs.length} únicos). Agrega más.`, status: 'warning' });
    } else {
      items.push({ text: 'Usa más verbos de acción fuertes (ej. Lideré, Diseñé)', status: 'failed' });
    }

    // 6. Word count optimization and page length
    const words = markdownText.trim().split(/\s+/).filter(w => w.length > 0).length;
    wordCountLabel.textContent = `${words} palabras`;
    
    // Check height of rendering in page-view
    const cvHeight = preview.scrollHeight;
    const pageLimitHeight = 2112; // 2 pages at 96 DPI
    
    if (cvHeight <= 1056) {
      score += 10;
      items.push({ text: 'Tamaño óptimo: CV cabe en 1 página', status: 'passed' });
    } else if (cvHeight <= pageLimitHeight) {
      score += 10;
      items.push({ text: 'Tamaño óptimo: CV cabe en 2 páginas', status: 'passed' });
    } else {
      items.push({ text: 'CV excede las 2 páginas. Reduce contenido.', status: 'warning' });
    }

    // Update ATS progress circle & score number
    scoreNum.textContent = `${score}%`;
    const dashOffset = 100 - score;
    scoreBar.style.strokeDasharray = `${score}, 100`;

    // Apply color threshold to circle stroke
    if (score >= 80) {
      scoreBar.style.stroke = 'var(--success-color)';
    } else if (score >= 50) {
      scoreBar.style.stroke = 'var(--warning-color)';
    } else {
      scoreBar.style.stroke = 'var(--danger-color)';
    }

    // Render Checklist UI
    checklistElement.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = `ats-item ${item.status}`;
      
      let icon = 'check-circle';
      if (item.status === 'failed') icon = 'x-circle';
      if (item.status === 'warning') icon = 'alert-circle';
      
      li.innerHTML = `<i data-lucide="${icon}"></i> <span>${item.text}</span>`;
      checklistElement.appendChild(li);
    });

    // Refresh icons
    lucide.createIcons();
  }

  // ==========================================================================
  // PAGE BREAK CALCULATION & ALIGNMENT
  // ==========================================================================
  function updatePageBreaks() {
    const showLines = checkPageBreaks.checked;
    
    if (!showLines) {
      breakLine1.style.display = 'none';
      breakLine2.style.display = 'none';
      paperContainer.style.minHeight = '1056px';
      return;
    }

    const totalHeight = preview.scrollHeight;
    
    // Position lines at exactly multiples of standard Letter height (1056px at 96 DPI)
    breakLine1.style.top = '1056px';
    breakLine2.style.top = '2112px';

    // Show/hide based on total scroll height of content
    if (totalHeight > 1056) {
      breakLine1.style.display = 'block';
      if (totalHeight > 2112) {
        breakLine2.style.display = 'block';
        paperContainer.style.minHeight = '3168px'; // Grow to 3 pages
      } else {
        breakLine2.style.display = 'none';
        paperContainer.style.minHeight = '2112px'; // Set to 2 pages height
      }
    } else {
      breakLine1.style.display = 'none';
      breakLine2.style.display = 'none';
      paperContainer.style.minHeight = '1056px'; // Set to 1 page height
    }
  }

  // ==========================================================================
  // EVENT BINDINGS & SYNCHRONIZATION
  // ==========================================================================
  
  // Real-time Editor Sync (Debounced for performance)
  let syncTimeout;
  editor.addEventListener('input', () => {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      const text = editor.value;
      parseAndRenderCV(text);
      runATSCheck(text);
    }, 150);
  });

  // Settings Sliders Controls
  
  // Font Selector
  selectFont.addEventListener('change', () => {
    const selectedFont = selectFont.value;
    preview.className = 'cv-preview ' + selectedFont;
    
    // Update font label text
    const textOptions = {
      'font-garamond': 'EB Garamond (Serif)',
      'font-inter': 'Inter (Sans-serif)',
      'font-system': 'Harvard Georgia (Serif)',
      'font-sans': 'Harvard Arial (Sans)'
    };
    fontVal.textContent = textOptions[selectedFont];
    updatePageBreaks();
  });

  // Font Size Slider
  sliderFontSize.addEventListener('input', () => {
    const size = sliderFontSize.value;
    document.documentElement.style.setProperty('--cv-font-size', `${size}pt`);
    fontSizeVal.textContent = `${size} pt`;
    updatePageBreaks();
  });

  // Margins Slider
  sliderMargins.addEventListener('input', () => {
    const margin = sliderMargins.value;
    document.documentElement.style.setProperty('--cv-margin', `${margin}in`);
    marginsVal.textContent = `${margin} in`;
    updatePageBreaks();
  });

  // Line Height Slider
  sliderLineHeight.addEventListener('input', () => {
    const lh = sliderLineHeight.value;
    document.documentElement.style.setProperty('--cv-line-height', lh);
    lineHeightVal.textContent = lh;
    updatePageBreaks();
  });

  // Section Spacing Slider
  sliderSectionSpace.addEventListener('input', () => {
    const space = sliderSectionSpace.value;
    document.documentElement.style.setProperty('--cv-section-spacing', `${space}px`);
    sectionSpaceVal.textContent = `${space} px`;
    updatePageBreaks();
  });

  // Checkbox for Page Break Lines
  checkPageBreaks.addEventListener('change', updatePageBreaks);

  // ==========================================================================
  // ACTION UTILITIES (IMPORT, DOWNLOAD, PRINT, PRESENT)
  // ==========================================================================
  
  // File Import handler
  btnImport.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      editor.value = evt.target.result;
      parseAndRenderCV(editor.value);
      runATSCheck(editor.value);
    };
    reader.readAsText(file);
  });

  // Markdown download
  btnExportMd.addEventListener('click', () => {
    const text = editor.value;
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Use first line H1 as filename if possible
    const firstLine = text.trim().split('\n')[0] || 'CV';
    const cleanName = firstLine.replace(/[#*`[\]]/g, '').trim() || 'CV';
    link.download = `CV - ${cleanName}.md`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  // Print PDF trigger
  btnPrint.addEventListener('click', () => {
    window.print();
  });

  // Toggle editor visibility (full screen preview)
  btnTogglePreview.addEventListener('click', () => {
    appContainer.classList.toggle('preview-only');
    const isPreviewOnly = appContainer.classList.contains('preview-only');
    
    // Update button icon
    const icon = btnTogglePreview.querySelector('i');
    if (isPreviewOnly) {
      icon.setAttribute('data-lucide', 'contract');
      btnTogglePreview.title = "Restaurar vista dividida";
    } else {
      icon.setAttribute('data-lucide', 'expand');
      btnTogglePreview.title = "Pantalla completa";
    }
    
    // Rebuild icons
    lucide.createIcons();
    setTimeout(updatePageBreaks, 100);
  });

  // Toggle sidebar panel visibility (collapsible menu)
  btnToggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    
    // Update button tooltip title
    if (isCollapsed) {
      btnToggleSidebar.title = "Mostrar panel de ajustes";
      btnToggleSidebar.classList.add('collapsed-active');
    } else {
      btnToggleSidebar.title = "Ocultar panel de ajustes";
      btnToggleSidebar.classList.remove('collapsed-active');
    }
    
    setTimeout(updatePageBreaks, 350); // Wait for sliding CSS animation to finish
  });

  // ==========================================================================
  // INITIAL RUN
  // ==========================================================================
  // Initial parsing and scoring
  parseAndRenderCV(editor.value);
  runATSCheck(editor.value);
  
  // Initialize Lucide Icons
  lucide.createIcons();
});
