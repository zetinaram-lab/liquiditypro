# 🧪 Guía de Testing - LiquidityPro v1.0.2

## Cómo Probar las Correcciones

### 🚀 Iniciar la Aplicación

```bash
# Opción 1: Con npm
cd /Users/huguettemont/Desktop/github_portfolio/liquiditypro-main
npm install
npm run dev

# Opción 2: Con bun
bun install
bun run dev

# Opción 3: Con yarn
yarn install
yarn dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## ✅ Test Suite #1: Layout en Español (Bug #8)

### Test 1.1: Cambio de Idioma
```
1. Abrir la aplicación
2. Observar el header superior derecho
3. Ver botones: [Calc. Posición] [EN]
4. Hacer clic en [EN]
5. ✅ VERIFICAR: Cambia a [ES]
6. ✅ VERIFICAR: Ambos botones siguen visibles
7. ✅ VERIFICAR: El texto "Calc. Posición" no se sale del botón
8. Hacer clic en [ES] para volver a inglés
9. ✅ VERIFICAR: Cambia a [EN]
10. ✅ VERIFICAR: Ambos botones siguen visibles
```

**✅ Resultado Esperado**: 
- Ambos botones siempre visibles
- Texto no se desborda
- Layout estable

### Test 1.2: Calculadora con Cambio de Idioma
```
1. Estar en inglés [EN]
2. Hacer clic en el botón [Position Sizer] (calculadora)
3. Se abre drawer a la derecha
4. Con drawer abierto, hacer clic en [EN]
5. ✅ VERIFICAR: Cambia a español
6. ✅ VERIFICAR: El botón ahora dice "Calc. Posición"
7. ✅ VERIFICAR: El botón [ES] sigue siendo clickeable
8. Hacer clic en [ES]
9. ✅ VERIFICAR: Cambia de vuelta a inglés
```

**✅ Resultado Esperado**: 
- Cambio de idioma funciona incluso con drawer abierto
- Z-index correcto (botón idioma z-20 > calculadora z-10)

### Test 1.3: Responsiveness
```
1. Estar en español [ES]
2. Redimensionar ventana del navegador a ancho mínimo (~600px)
3. ✅ VERIFICAR: El texto "Calc. Posición" se trunca con "..."
4. ✅ VERIFICAR: El botón no crece más de 120px
5. ✅ VERIFICAR: Ambos botones siguen accesibles
```

**✅ Resultado Esperado**: 
- Truncamiento funciona
- Layout responsive

---

## ✅ Test Suite #2: Cambio de Timeframe (Bug #9)

### Test 2.1: Cambios Individuales
```
1. Observar el gráfico principal (velas)
2. Ver selector de timeframe: [1m] [5m] [15m] [1h] [4h] [1D]
3. Hacer clic en [1m]
4. ✅ VERIFICAR: Aparece spinner pequeño a la derecha del selector
5. ✅ VERIFICAR: Botones se deshabilitan brevemente
6. ✅ VERIFICAR: El gráfico se actualiza sin crash
7. ✅ VERIFICAR: [1m] queda resaltado
8. Esperar 1 segundo
9. Hacer clic en [5m]
10. ✅ VERIFICAR: Mismo comportamiento suave
11. Probar cada timeframe: [15m], [1h], [4h], [1D]
12. ✅ VERIFICAR: Ningún cambio causa crash
```

**✅ Resultado Esperado**: 
- Sin crashes
- Spinner visible durante cambio
- Gráfico se actualiza correctamente

### Test 2.2: Clics Rápidos (Throttling)
```
1. Hacer clic RÁPIDO en [1m] → [5m] → [15m] → [1h]
   (lo más rápido posible, < 500ms entre clics)
2. ✅ VERIFICAR: Solo el primer clic es procesado
3. ✅ VERIFICAR: Los siguientes clics son bloqueados (no hacen nada)
4. ✅ VERIFICAR: Spinner aparece solo una vez
5. ✅ VERIFICAR: Console muestra mensaje: "Cambio bloqueado: demasiado rápido"
6. Esperar 1 segundo
7. Hacer clic en otro timeframe
8. ✅ VERIFICAR: Ahora sí funciona (throttling expiró)
```

**✅ Resultado Esperado**: 
- Throttling previene clics múltiples
- Sin crashes
- Logs en consola

### Test 2.3: Cambio Durante Actualización
```
1. Observar el indicador "LIVE" pulsando (datos actualizándose cada 2s)
2. Hacer clic en [1h]
3. Mientras el spinner está visible, intentar hacer clic en [4h]
4. ✅ VERIFICAR: El segundo clic es ignorado
5. ✅ VERIFICAR: Los botones están deshabilitados (opacidad 50%)
6. Esperar a que termine el cambio
7. ✅ VERIFICAR: Botones se rehabilitan
8. Ahora hacer clic en [4h]
9. ✅ VERIFICAR: Funciona correctamente
```

**✅ Resultado Esperado**: 
- No se pueden hacer cambios durante otro cambio
- Botones deshabilitados visualmente

### Test 2.4: Mismo Timeframe
```
1. Ver que [15m] está seleccionado (resaltado)
2. Hacer clic en [15m] otra vez
3. ✅ VERIFICAR: No pasa nada (no hay spinner, no se recarga)
4. ✅ VERIFICAR: El gráfico no se actualiza innecesariamente
5. ✅ VERIFICAR: Console no muestra errores
```

**✅ Resultado Esperado**: 
- Clic en mismo timeframe es ignorado
- Sin re-renders innecesarios

---

## ✅ Test Suite #3: Integración (Ambos Bugs)

### Test 3.1: Cambio de Idioma + Timeframe Simultáneo
```
1. Estar en [15m] y en [EN]
2. Hacer clic en [EN] para cambiar a español
3. Inmediatamente hacer clic en [1h]
4. ✅ VERIFICAR: Ambos cambios funcionan correctamente
5. ✅ VERIFICAR: El botón ahora dice "Calc. Posición"
6. ✅ VERIFICAR: El gráfico cambió a 1h
7. ✅ VERIFICAR: Sin crashes ni errores
```

### Test 3.2: Calculadora + Timeframe
```
1. Abrir la calculadora (drawer a la derecha)
2. Con drawer abierto, cambiar timeframe
3. ✅ VERIFICAR: El timeframe cambia correctamente
4. ✅ VERIFICAR: El drawer permanece abierto
5. ✅ VERIFICAR: Sin errores en consola
```

### Test 3.3: Stress Test
```
1. Hacer estas acciones rápidamente en secuencia:
   - Cambiar idioma
   - Cambiar timeframe
   - Abrir calculadora
   - Cambiar idioma
   - Cambiar timeframe
   - Cerrar calculadora
   - Cambiar timeframe 3 veces rápido
2. ✅ VERIFICAR: La app permanece estable
3. ✅ VERIFICAR: Sin crashes
4. ✅ VERIFICAR: UI responde correctamente
```

---

## 🔍 Verificar en Consola del Navegador

### Abrir Developer Tools
```
Chrome/Edge: F12 o Cmd+Option+I (Mac) o Ctrl+Shift+I (Windows)
Firefox: F12 o Cmd+Option+K (Mac) o Ctrl+Shift+K (Windows)
Safari: Cmd+Option+C
```

### Logs Esperados (Buenos)
```javascript
✅ "WebSocket connected"
✅ "Cambio bloqueado: demasiado rápido" (cuando haces clics rápidos)
✅ Ningún error rojo
```

### Errores NO Esperados (Malos)
```javascript
❌ "Cannot read property 'time' of undefined"
❌ "chart is not defined"
❌ "Maximum update depth exceeded"
❌ Cualquier error rojo
```

---

## 📊 Checklist de Verificación

### Layout (Bug #8)
- [ ] Botón calculadora tiene texto truncado
- [ ] Botón idioma siempre visible
- [ ] Cambio de idioma EN ↔ ES funciona
- [ ] Layout no se rompe en español
- [ ] Responsive en pantallas pequeñas

### Timeframe (Bug #9)
- [ ] Cambios individuales funcionan
- [ ] Spinner aparece durante cambio
- [ ] Throttling bloquea clics rápidos
- [ ] Mismo timeframe es ignorado
- [ ] Sin crashes con clics rápidos
- [ ] Gráfico se actualiza correctamente

### General
- [ ] Sin errores en consola
- [ ] Indicador LIVE pulsando
- [ ] Precios actualizándose
- [ ] Calculadora funciona
- [ ] Performance fluida

---

## 🐛 Si Encuentras un Bug

### Información a Reportar
```markdown
1. **Navegador**: Chrome / Firefox / Safari / Edge
2. **Versión**: (del navegador)
3. **OS**: macOS / Windows / Linux
4. **Pasos para reproducir**:
   - Paso 1
   - Paso 2
   - Paso 3
5. **Resultado esperado**: 
6. **Resultado actual**:
7. **Screenshot**: (si es posible)
8. **Errores en consola**: (copiar y pegar)
```

---

## ✅ Resultados Esperados Generales

### Performance
- ⚡ Cambio de timeframe: < 100ms
- ⚡ Cambio de idioma: instantáneo
- ⚡ Apertura de calculadora: < 200ms
- ⚡ Actualización de precios: cada 2s

### Estabilidad
- ✅ 0 crashes
- ✅ 0 errores en consola
- ✅ 0 memory leaks
- ✅ UI siempre responsiva

### UX
- ✅ Feedback visual inmediato
- ✅ Throttling apropiado
- ✅ Botones deshabilitados cuando corresponde
- ✅ Layout estable en todos los idiomas

---

## 🎯 Test de Aceptación Final

Si TODOS estos checks pasan, la app está lista:

```
✅ Cambio de idioma 10 veces seguidas → Sin errores
✅ Cambio de timeframe 10 veces seguidas → Sin crashes
✅ Clics rápidos en timeframes → Bloqueados apropiadamente
✅ Layout estable en español → Botones visibles
✅ Calculadora + cambio de idioma → Funciona
✅ Console sin errores rojos → Limpia
✅ Performance fluida → < 100ms por acción
✅ Memoria estable → Sin leaks
```

---

## 📞 Comandos Útiles

### Ver Logs en Tiempo Real
```bash
# En la terminal donde corre npm run dev
# Los errores aparecerán aquí también
```

### Limpiar Cache y Reiniciar
```bash
# Si algo parece raro, limpia y reinicia:
rm -rf node_modules/.vite
npm run dev
```

### Build de Producción
```bash
npm run build
npm run preview
# Probar en http://localhost:4173
```

---

**Fecha**: 25 de diciembre de 2024  
**Versión**: 1.0.2  
**Status**: Ready for Testing ✅

¡Buena suerte con las pruebas! 🧪🚀
