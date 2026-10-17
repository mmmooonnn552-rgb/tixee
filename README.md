# Cairo Drive 3D — GLB/GLTF Edition

هذه **ترقية للمشروع السابق وليست إعادة تصميم Prototype**. تم تغيير طبقة الأصول بحيث لا تنشئ اللعبة أي سيارة أو مبنى أو طريق رئيسي من BoxGeometry/CubeGeometry أو بدائل مكعبة. جميع العناصر الرئيسية تأتي من ملفات GLB/GLTF يتم تحميلها بواسطة `GLTFLoader`.

## 1) هيكل المشروع

```text
cairo_3d_drive/
├─ index.html
├─ style.css
├─ main.js
├─ assetLoader.js
├─ vehicle.js
├─ city.js
├─ traffic.js
├─ camera.js
├─ controls.js
├─ audio.js
├─ ui.js
└─ assets/
   ├─ manifest.json
   ├─ README.md
   └─ models/
      ├─ cars/
      ├─ buildings/
      ├─ roads/
      ├─ props/
      └─ environment/
```

## 2) أين تضع GLB؟

افتح `assets/models/` وضع الملفات حسب `assets/manifest.json`.

أهم ملف إلزامي للبدء:

```text
assets/models/cars/player_car.glb
```

ويجب أيضًا توفير نماذج الطرق الأساسية:

```text
assets/models/roads/road_straight.glb
assets/models/roads/road_intersection.glb
assets/models/roads/sidewalk.glb
assets/models/roads/curb.glb
```

ثم أضف نماذج السيارات والمباني والعناصر الموجودة في الـmanifest.

## 3) لماذا لا توجد سيارات/مبانٍ مزيفة داخل المشروع؟

لأن المطلوب كان صريحًا: إذا لم يوجد Asset حقيقي فلا يتم اختراع Cube كبديل. لذلك عند غياب ملف GLB، يظل المكان فارغًا وتظهر قائمة واضحة بالملفات الناقصة. بعد وضع الـGLB، يتم تحميله مباشرة بدون تغيير كود اللعبة.

## 4) LOD

يمكن وضع ثلاث نسخ لكل أصل:

```text
model.glb
model_medium.glb
model_low.glb
```

الـloader يحاول High ثم Medium ثم Low. هذا يقلل حجم التحميل والتكلفة عند استخدام نسخ منخفضة التفاصيل. للحصول على LOD مسافة متقدمة جدًا، يفضل دمج مستويات LOD داخل GLB نفسه أو إضافة نظام `THREE.LOD` عند توفر نسخ المسافات.

## 5) مواصفات GLB المقترحة

- GLB 2.0.
- Y-up.
- الوحدات بالمتر.
- Origin قريب من مركز النموذج.
- السيارة الأمامية باتجاه `-Z`.
- السيارة الرئيسية تحتوي إن أمكن على Objects للعجلات بأسماء `wheel_fl`, `wheel_fr`, `wheel_rl`, `wheel_rr`.
- خامات PBR.
- 1K أو 2K textures للموبايل، و4K فقط للأصول القريبة جدًا عند الحاجة.
- تجنب textures ضخمة غير ضرورية.

## 6) تشغيل اللعبة

لا تفتح `index.html` مباشرة بـ `file://`.

استخدم خادمًا محليًا، مثل:

```bash
python -m http.server 8000
```

ثم:

```text
http://localhost:8000
```

أو استخدم VS Code + Live Server.

## 7) التحكم

### الكمبيوتر
- W / ↑: بنزين
- S / ↓: فرامل / إبطاء
- A / ←: يسار
- D / →: يمين
- Space: Handbrake
- C: تبديل الكاميرا
- Esc: Pause

### الهاتف
أزرار لمس: Left / Right / GAS / BRAKE / HB.

## 8) الكاميرات

- First Person
- Driver
- Third Person
- Close Third Person
- Cinematic

## 9) Traffic AI

السيارات تستخدم نمط حارات ثابتة داخل شبكة المدينة، بسرعات مختلفة، وتباطؤ عند إشارات المرور وعند اقترابها من السيارة، مع تدوير العجلات أثناء الحركة وإعادة تدوير السيارات عند حدود الخريطة.

## 10) الترخيص

هذا المشروع لا يضم ملفات GLB تجارية جاهزة. أنت مسؤول عن وضع Assets تملك حق استخدامها. لا تستخدم سيارات أو شعارات أو نماذج مدفوعة/محميّة بدون الترخيص المناسب.

## 11) التحقق

قبل التسليم تم فحص Syntax لملفات JavaScript المحلية ومراجع الـimports. كما أن المشروع لا يعتمد على ملفات GLB مخفية أو روابط لنماذج غير موجودة؛ كل Asset خارجي معلن صراحة في `assets/manifest.json`.

## Fastest asset setup

1. Download these five packs from Kenney: Car Kit, City Kit Roads, City Kit Commercial, City Kit Suburban, Nature Kit.
2. Extract the GLB/glTF models.
3. Rename/copy the models to the exact filenames in `ASSET_SOURCES.md`.
4. Start the project with a local server (for example VS Code Live Server).
5. Open DevTools → Console if you want to see missing asset messages.
6. You do not need to edit JavaScript or `assets/manifest.json`.
