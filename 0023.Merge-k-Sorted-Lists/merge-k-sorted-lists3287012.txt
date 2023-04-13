// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3287012/rust-binaryheap/
use std::cmp::Ordering;
use std::collections::BinaryHeap;

impl Ord for ListNode {
    fn cmp(&self, other: &Self) -> Ordering {
        other.partial_cmp(self).unwrap()
    }
}

impl PartialOrd for ListNode {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(other.val.cmp(&self.val))
    }
}

impl Solution {
    pub fn merge_k_lists(lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        let mut heap: BinaryHeap<_> = lists
            .into_iter()
            .filter_map(|node| node)
            .collect();

        let mut head = None;
        let mut cur = &mut head;

        while let Some(mut node) = heap.pop() {
            if let Some(next) = node.next.take() {
                heap.push(next);
            }
            *cur = Some(node);
            cur = &mut cur.as_mut().unwrap().next;
        }

        head
    }
}