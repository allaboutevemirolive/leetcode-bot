// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3340432/rust-solution-with-binaryheap/
use std::cmp::Ordering;
use std::cmp::Reverse;
use std::collections::BinaryHeap;

impl Solution {
    pub fn merge_k_lists(lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        let mut dummy = ListNode::new(-1);
        let mut cur = &mut dummy;

        let mut heap = BinaryHeap::new();
        for list in lists {
            if let Some(node) = list {
                heap.push(Reverse(node));
            }
        }

        while let Some(Reverse(mut node)) = heap.pop() {
            if let Some(next_node) = node.next.take() {
                heap.push(Reverse(next_node));
            }
            cur.next = Some(node);
            cur = cur.next.as_mut().unwrap();
        }

        dummy.next
    }
}

impl Ord for ListNode {
    fn cmp(&self, other: &Self) -> Ordering {
        self.val.cmp(&other.val)
    }
}

impl PartialOrd for ListNode {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}