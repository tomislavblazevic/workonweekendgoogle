/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-explicit-any */

// FIX: Added react import to treat this file as a module.
// This allows module augmentation for '@vis.gl/react-google-maps'.
// @google/genai-fix: Changed `import type React from 'react'` to `import React from 'react'` to correctly import the React namespace.
import React from 'react';

// add an overload signature for the useMapsLibrary hook, so typescript
// knows what the 'maps3d' library is.
declare module '@vis.gl/react-google-maps' {
  export function useMapsLibrary(
    name: 'maps3d'
  ): google.maps.Maps3DLibrary | null;
  // FIX: Add overload for 'elevation' library to provide strong types for the ElevationService.
  export function useMapsLibrary(
    name: 'elevation'
  ): google.maps.ElevationLibrary | null;
  // Add overload for 'places' library
  export function useMapsLibrary(
    name: 'places'
  ): google.maps.PlacesLibrary | null;
  // Add overload for 'geocoding' library
  export function useMapsLibrary(
    name: 'geocoding'
  ): google.maps.GeocodingLibrary | null;
}

// temporary fix until @types/google.maps is updated with the latest changes
// Only augment the google.maps namespace for the `maps3d` pieces we need
// to avoid duplicating types already provided by `@types/google.maps`.
declare global {
  namespace google.maps {
    // Lightweight augmentations for pieces used by the app that aren't
    // guaranteed to exist in the installed `@types/google.maps` package.
    // These are minimal and purpose-built to avoid duplicating broad
    // type declarations from `@types/google.maps`.
    interface PlacesLibrary {
      PlaceContextualElement?: { new (...args: any[]): any };
      PlaceContextualListConfigElement?: { new (...args: any[]): any };
    }

    interface Maps3DLibrary {
      Marker3DInteractiveElement?: { new (options?: any): any };
    }
    // Interface to expose minimal maps3d element and camera option types used
    // by this project. Keep these narrow to avoid collisions with the
    // broader `@types/google.maps` definitions.
    namespace maps3d {
      interface CameraOptions {
        center?: google.maps.LatLngAltitudeLiteral;
        heading?: number;
        range?: number;
        roll?: number;
        tilt?: number;
      }

      interface FlyAroundAnimationOptions {
        camera: CameraOptions;
        durationMillis?: number;
        rounds?: number;
      }

      interface FlyToAnimationOptions {
        endCamera: CameraOptions;
        durationMillis?: number;
      }

      interface Map3DElement extends HTMLElement {
        mode?: 'HYBRID' | 'SATELLITE';
        flyCameraAround: (options: FlyAroundAnimationOptions) => void;
        flyCameraTo: (options: FlyToAnimationOptions) => void;
        // Keep attributes permissive to avoid conflicts with core map types
  center?: google.maps.LatLngAltitudeLiteral;
        heading?: number;
        range?: number;
        roll?: number;
        tilt?: number;
        defaultUIHidden?: boolean;
      }

      interface Map3DElementOptions {
        center?: google.maps.LatLngAltitudeLiteral;
        heading?: number;
        range?: number;
        roll?: number;
        tilt?: number;
        defaultUIHidden?: boolean;
      }
    }
  }
}

// add the <gmp-map-3d> custom-element to the JSX.IntrinsicElements
// interface, so it can be used in jsx
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ['gmp-map-3d']: CustomElement<
        google.maps.maps3d.Map3DElement,
        google.maps.maps3d.Map3DElement
      >;
    }
  }
}

// a helper type for CustomElement definitions
type CustomElement<TElem, TAttr> = Partial<
  TAttr &
    // FIX: Use fully-qualified type names since the import was removed.
    React.DOMAttributes<TElem> &
    React.RefAttributes<TElem> & {
      // for whatever reason, anything else doesn't work as children
      // of a custom element, so we allow `any` here
      children: any;
    }
>;
