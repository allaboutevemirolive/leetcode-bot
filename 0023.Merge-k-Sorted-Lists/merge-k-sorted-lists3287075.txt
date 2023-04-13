// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3287075/rust-priority-queue-solution/
use std::{cmp::Reverse, collections::BinaryHeap};

impl Solution {
    pub fn merge_k_lists(lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        let mut pq = BinaryHeap::new();
        for lst in lists {
            if let Some(node) = lst {
                pq.push(Reverse(node));
            }
        }
        let mut dummy_root = ListNode::new(0);
        let mut p = &mut dummy_root;
        while let Some(Reverse(mut node)) = pq.pop() {
            if let Some(next) = node.next.take() {
                pq.push(Reverse(next));
            }
            p.next = Some(node);
            p = p.next.as_mut().unwrap();
        }
        dummy_root.next
    }
}

impl PartialOrd for ListNode {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        self.val.partial_cmp(&other.val)
    }
}

impl Ord for ListNode {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.partial_cmp(other).unwrap()
    }
}