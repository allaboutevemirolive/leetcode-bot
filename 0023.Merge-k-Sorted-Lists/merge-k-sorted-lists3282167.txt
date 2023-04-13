// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3282167/blazingly-fast-rust-solution/
#[derive(PartialEq, Eq)]
struct MinHeapList<'a> {
    val: i32,
    node: &'a Box<ListNode>,
}

impl<'a> MinHeapList<'a> {
    #[inline]
    fn new(node: &'a Box<ListNode>) -> Self {
        Self {
            // note: negating because we want min-heap behavior
            val: -node.val,
            node: &node,
        }
    }
}

impl PartialOrd for MinHeapList<'_> {
    #[inline]
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        self.val.partial_cmp(&other.val)
    }
}

impl Ord for MinHeapList<'_> {
    #[inline]
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.val.cmp(&other.val)
    }
}

use std::collections::BinaryHeap;

impl Solution {
    pub fn merge_k_lists(lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        let mut pq = BinaryHeap::with_capacity(lists.len());

        for node in &lists {
            if let Some(node) = node {
                pq.push(MinHeapList::new(&node));
            }
        }

        let mut dummy = Box::new(ListNode::new(0));
        let mut cur = &mut dummy;

        while let Some(MinHeapList { val: head, node }) = pq.pop() {
            cur.next = Some(Box::new(ListNode::new(-head)));
            cur = cur.next.as_mut().unwrap();

            if let Some(remainder) = &node.next {
                pq.push(MinHeapList::new(remainder))
            }
        }

        dummy.next
    }
}
