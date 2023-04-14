// https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/solutions/2574949/rust-3-solutions-binary-heap-with-binary-search-binaryheap-btree/
use std::cmp::Ordering;
use std::collections::BinaryHeap;

#[derive(Debug, Eq)]
struct ArrOrd<'l>(i32, &'l [i32]);

impl<'l> PartialEq for ArrOrd<'l> {
    fn eq(&self, other: &Self) -> bool {
        self.0 == other.0
    }
}

impl<'l> Ord for ArrOrd<'l> {
    fn cmp(&self, other: &Self) -> Ordering {
        // Because we are using MaxHeap, we have to invert
        // the sort order in order to use it as a MinHeap
        self.0.cmp(&other.0).reverse()
    }
}

impl<'l> PartialOrd for ArrOrd<'l> {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

pub fn smallest_range(nums: Vec<Vec<i32>>) -> Vec<i32> {
    // Corner case when we have only one array in `nums`
    if nums.len() == 1 {
        return vec![nums[0][0], nums[0][0]];
    }

    // Put all arrays in to a PQ in order to be able to always get the array
    // with the smallest element at the front
    let mut queue = BinaryHeap::with_capacity(nums.len());
    for arr in nums.iter() {
        queue.push(ArrOrd(arr[0], arr.as_slice()));
    }

    let mut min = i32::MAX;
    let mut max = i32::MIN;
    let mut diff = i32::MAX;

    let mut previous = i32::MIN;
    while let Some(ArrOrd(range_min, array)) = queue.pop() {
        // Skip repeating elements we have already processed
        if range_min != previous {
            // remember the last processed minimum value,
            // in order to avoid recomputing the same operation
            // over and over again, in case many arrays have the
            // same minimum
            previous = range_min;

            let mut range_max = i32::MIN;
            for arr in queue.iter() {
                let right_bound = find_eq_or_larger(arr.1, range_min);
                range_max = range_max.max(right_bound);
            }

            // Check if we have achieved a better result
            if range_max - range_min < diff {
                diff = range_max - range_min;
                max = range_max;
                min = range_min;

                // We cannot do any better - all sub-arrays are covered
                // by the same range of 1 element
                if diff == 0 {
                    break;
                }
            }
        }

        let array = &array[1..];
        // If we cannot shrink the array any more,then we
        // cannot find other potential "range minimum" values
        // that cover al the arrays. Thus we cannot find a better
        // interval than the already found one.
        if array.is_empty() {
            break;
        }

        // Re-queue the array with the updated minimum value
        queue.push(ArrOrd(array[0], array));
    }

    vec![min, max]
}

fn find_eq_or_larger(arr: &[i32], key: i32) -> i32 {
    let mut lo = 0;
    let mut hi = arr.len() - 1;

    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if arr[mid] < key {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }

    arr[hi]
}