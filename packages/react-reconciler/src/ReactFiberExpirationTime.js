/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import MAX_SIGNED_31_BIT_INT from './maxSigned31BitInt';

export type ExpirationTime = number;

export const NoWork = 0;
export const Never = 1;
export const Sync = MAX_SIGNED_31_BIT_INT;

const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = MAX_SIGNED_31_BIT_INT - 1;

// 1 unit of expiration time represents 10ms.
export function msToExpirationTime(ms: number): ExpirationTime {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  // 这英文注释应该是以前代码的：((ms / UNIT_SIZE) | 0) + MAGIC_NUMBER_OFFSET;
  // 为了不与 NoWork(0) 冲突
  // 详见：https://gist.github.com/Jokcy/f1c3b5cb03c35a930eb5862778ef1db3#file-reactfiberexpirationtime-js-L24

  // 后来为了方便代码书写，倒序排列了，名字还用的原来的，更新 MR: https://github.com/facebook/react/pull/13912

  // | 0 表示取整
  // 10 ms 以内，返回相同的 expirationTime
  // expirationTime的单位是 unit, 即：N unit
  // 现在的意思大概是：expirationTime 越大，优先级越高（虽然有些歧义，返过来的样子，后续官方会调整名字）
  return MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0);
}

// ms 跟 expirationTime 之前的互相转换
export function expirationTimeToMs(expirationTime: ExpirationTime): number {
  return (MAGIC_NUMBER_OFFSET - expirationTime) * UNIT_SIZE;
}

function ceiling(num: number, precision: number): number {
  // +1 表示向上取整
  return (((num / precision) | 0) + 1) * precision;
}

function computeExpirationBucket(
  currentTime,
  expirationInMs,
  bucketSizeMs,
): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET -
    ceiling(
      MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE,
    )
  );
}


 // (((((currentTime / 10) | 0) + 5000 / 10) / (250 / 10) | 0) + 1) * (250 / 10)
 // n * 250 =< currentTime < (n + 1) * 250      n >= 0
 // 250 ms 之间（一个区间）内，会返回相同的 expirationTime，250ms 内的 work 将会进行 batchedUpdates
 // 也就是说，只需要判断相同的 expirationTime，就可以判断是否需要 batchedUpdtes
 // 最晚执行时间是（相对）：5250 ms
 // 举例：5250 ~ 5499 ms 内的 updates 将会被 batched
export const LOW_PRIORITY_EXPIRATION = 5000;
export const LOW_PRIORITY_BATCH_SIZE = 250;

export function computeAsyncExpiration(
  currentTime: ExpirationTime,
): ExpirationTime {
  return computeExpirationBucket(
    currentTime,
    LOW_PRIORITY_EXPIRATION, // 超期时间
    LOW_PRIORITY_BATCH_SIZE, // batched 区间
  );
}

// We intentionally set a higher expiration time for interactive updates in
// dev than in production.
//
// If the main thread is being blocked so long that you hit the expiration,
// it's a problem that could be solved with better scheduling.
//
// People will be more likely to notice this and fix it with the long
// expiration time in development.
//
// In production we opt for better UX at the risk of masking scheduling
// problems, by expiring fast.
export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150;
export const HIGH_PRIORITY_BATCH_SIZE = 100;

export function computeInteractiveExpiration(currentTime: ExpirationTime) {
  return computeExpirationBucket(
    currentTime,
    HIGH_PRIORITY_EXPIRATION,
    HIGH_PRIORITY_BATCH_SIZE,
  );
}
