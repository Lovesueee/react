/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
// 对于位运算，JavaScript仅支持32位整型数，否则会出错
// 详见：http://blog.shaochuancs.com/javascript-number-range/
// 值的范围是：[-2^31, +2^31 - 1]
// 详见：https://yanhaijing.com/javascript/2016/07/20/binary-in-js/
// 这里用的是 31 位有符号（即：最大值 2^30 - 1），不知为啥?!
// 后记：大概知道了，详见这里：https://zhuanlan.zhihu.com/p/43992828
// 这里知道最大数就是：Math.pow(2, 30) - 1
// 在引擎 内部，V8 使用最低有效位将所有 JavaScript 值标记为堆栈对象或者 Smis。
// 如果最低有效位是 1，则是指针。如果是 0，则是 Smi。这意味着 32 位整数只能使用 31 位存储 Smi 值，因为一位（最低有效位）用作标记。
export default 1073741823;
