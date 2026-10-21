/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Supported semantic toast types.
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Props for the Toast component.
 */
export interface ToastProps {
  /**
   * The semantic type of the toast which determines styling and icon.
   */
  type: ToastType;

  /**
   * Dynamic notification message to display.
   */
  message: string;

  /**
   * Callback invoked when the user dismisses the toast or duration expires.
   */
  onClose: () => void;

  /**
   * Optional auto-dismiss duration in milliseconds.
   * If provided and greater than 0, the toast will auto-close after this duration.
   */
  duration?: number;

  /**
   * Optional additional CSS classes for custom positioning or layout overrides.
   */
  className?: string;
}
