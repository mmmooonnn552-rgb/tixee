# Cairo Drive 3D — Final Asset Sources

This project is already wired to these exact paths. The browser loads them with Three.js `GLTFLoader`.

**No CubeGeometry, BoxGeometry, or generated placeholder geometry is used for the main 3D assets.**

## Do this exactly

Download the models listed below, rename them to the **Project filename**, and place them in the specified folder. After that, **do not edit JavaScript or `assets/manifest.json`**.

### Final table

| Project filename | Type | Put it here | Source / download | Required? |
|---|---|---|---|---|
| `player_car.glb` | Player car | `assets/models/cars/` | Kenney Car Kit: https://kenney.nl/assets/car-kit — use `sedan.glb` and copy/rename it to `player_car.glb` | YES |
| `sedan.glb` | Traffic car | `assets/models/cars/` | Kenney Car Kit: https://kenney.nl/assets/car-kit | YES |
| `suv.glb` | Traffic car | `assets/models/cars/` | Kenney Car Kit: https://kenney.nl/assets/car-kit | YES |
| `taxi.glb` | Traffic car | `assets/models/cars/` | Kenney Car Kit: https://kenney.nl/assets/car-kit | YES |
| `van.glb` | Traffic car | `assets/models/cars/` | Kenney Car Kit: https://kenney.nl/assets/car-kit | YES |
| `police.glb` | Traffic car | `assets/models/cars/` | Kenney Car Kit: https://kenney.nl/assets/car-kit | YES |
| `house_tall.glb` | Residential building | `assets/models/buildings/` | Innerscene: https://www.innerscene.com/tools/library/3d-parts/low-poly-city-house-building-tall-3b161b3a | YES |
| `apartment_tall.glb` | Apartment building | `assets/models/buildings/` | Innerscene: https://www.innerscene.com/tools/library/3d-parts/low-poly-city-apartment-building-tall-a3dc8263 | YES |
| `office_low.glb` | Office building | `assets/models/buildings/` | Innerscene: https://www.innerscene.com/tools/library/3d-parts/low-poly-city-office-building-low-fdbb611c | YES |
| `building_a.glb` | Extra building | `assets/models/buildings/` | Kenney City Kit Commercial: https://kenney.nl/assets/city-kit-commercial | NO |
| `skyscraper_a.glb` | Extra skyscraper | `assets/models/buildings/` | Kenney City Kit Commercial: https://kenney.nl/assets/city-kit-commercial | NO |
| `road_straight.glb` | Straight road | `assets/models/roads/` | Innerscene: https://www.innerscene.com/tools/library/3d-parts/low-poly-city-road-straight-cf2e392c | YES |
| `road_intersection.glb` | Intersection | `assets/models/roads/` | Kenney City Kit Roads: https://kenney.nl/assets/city-kit-roads (use the road crossing/intersection GLB) | YES |
| `road_side.glb` | Sidewalk | `assets/models/roads/` | Flockbay/Kenney Road Side: https://flockbay.com/assets/road-side-city-kit-roads/ | YES |
| `traffic_light.glb` | Traffic light | `assets/models/props/` | Innerscene: https://www.innerscene.com/tools/library/3d-parts/low-poly-city-traffic-light-94ebd054 | YES |
| `street_light.glb` | Street lamp | `assets/models/props/` | Innerscene: https://www.innerscene.com/tools/library/3d-parts/low-poly-city-street-lamp-f1b98623 | YES |
| `tree_palmTall.glb` | Tree | `assets/models/environment/` | Innerscene: https://www.innerscene.com/tools/library/3d-parts/low-poly-city-tree-80877d8e | YES |
| `shopfront.glb` | Shop/street building | `assets/models/props/` | Innerscene: https://www.innerscene.com/tools/library/3d-parts/low-poly-city-shop-building-low-ad90cab2 | NO |
| `trash_bin.glb` | Street bin | `assets/models/props/` | Kenney City Kit / Innerscene CC0 city props | NO |
| `billboard.glb` | Billboard | `assets/models/props/` | Kenney City Kit Commercial: https://kenney.nl/assets/city-kit-commercial | NO |
| `construction_barrier.glb` | Road barrier | `assets/models/props/` | Kenney City Kit Roads: https://kenney.nl/assets/city-kit-roads | NO |

## License check

- Kenney Car Kit is CC0 according to Kenney's official asset page.
- Kenney City Kit Roads is CC0 and includes road pieces, barriers, signs and traffic lights.
- Kenney City Kit Commercial/Suburban are CC0.
- The linked Innerscene city models above explicitly state CC0/public-domain licensing on their model pages.

## Exact folder structure

```text
assets/
└── models/
    ├── cars/
    │   ├── player_car.glb
    │   ├── sedan.glb
    │   ├── suv.glb
    │   ├── taxi.glb
    │   ├── van.glb
    │   └── police.glb
    ├── buildings/
    │   ├── house_tall.glb
    │   ├── apartment_tall.glb
    │   ├── office_low.glb
    │   ├── building_a.glb       (optional)
    │   └── skyscraper_a.glb     (optional)
    ├── environment/
    │   └── tree_palmTall.glb
    ├── props/
    │   ├── traffic_light.glb
    │   ├── street_light.glb
    │   ├── shopfront.glb        (optional)
    │   ├── trash_bin.glb        (optional)
    │   ├── billboard.glb        (optional)
    │   └── construction_barrier.glb (optional)
    └── roads/
        ├── road_straight.glb
        ├── road_intersection.glb
        └── road_side.glb
```

## Important texture note

Some GLB downloads may reference an external texture file/folder. **Keep the texture files beside the GLB exactly as downloaded**. Kenney's own documentation notes that some packs include separate textures alongside the model files.

## Missing files

The game no longer crashes just because an asset is missing. The Console will show:

`[ASSET MISSING] assets/models/cars/sedan.glb`

Optional assets can remain missing. For the intended complete version, download all files marked **YES**.
