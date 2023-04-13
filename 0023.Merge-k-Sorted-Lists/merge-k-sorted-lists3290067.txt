// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3290067/concise-binaryheap-solution-in-rust/
use std::cmp::Ordering;
use std::collections::BinaryHeap;

impl PartialOrd for ListNode {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}
impl Ord for ListNode {
    fn cmp(&self, other: &Self) -> Ordering {
        self.val.cmp(&other.val).reverse()
    }
}

impl Solution {
    pub fn merge_k_lists(lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        let mut heap = lists.into_iter().filter_map(|list| list).collect::<BinaryHeap<_>>();
        let mut head = None;
        let mut tail = &mut head;
        while let Some(node) = heap.pop() {
            tail = &mut tail.insert(node).next;
            if let Some(next) = tail.take() {
                heap.push(next);
            }
        }
        head
    }
}