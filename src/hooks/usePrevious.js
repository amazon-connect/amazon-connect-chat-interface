// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useEffect, useRef } from "react";

/**
 * Hook to access values from previous render. Example:
 * 
 * function myComponent({width}) {
 *     const previousWidth = usePrevious(width);
 *     if (width > previousWidth) {
 *         // ....
 *     }
 * }
 */
export default function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
