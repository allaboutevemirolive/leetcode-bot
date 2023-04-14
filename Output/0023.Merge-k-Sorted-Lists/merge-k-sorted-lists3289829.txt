// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3289829/rust-binaryheap-short-and-clean/

impl Solution {
    pub fn merge_k_lists(lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        let mut heap = std::collections::BinaryHeap::new();
        for mut next in lists {
            while let Some(item) = next {
                heap.push(item.val);
                next = item.next;
            }
        }
        let mut res = None;
        while let Some(item) = heap.pop() {
            res = Some(Box::new(ListNode{val: item, next: res}));
        }
        res
    }
}