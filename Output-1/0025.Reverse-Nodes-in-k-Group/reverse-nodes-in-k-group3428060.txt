// https://leetcode.com/problems/reverse-nodes-in-k-group/solutions/3428060/zero-allocation-0ms-rust-solution/
// Definition for singly-linked list.
// #[derive(PartialEq, Eq, Clone, Debug)]
// pub struct ListNode {
//   pub val: i32,
//   pub next: Option<Box<ListNode>>
// }
// 
// impl ListNode {
//   #[inline]
//   fn new(val: i32) -> Self {
//     ListNode {
//       next: None,
//       val
//     }
//   }
// }

use std::mem;

impl Solution {
    pub fn reverse_k_group(mut head: Option<Box<ListNode>>, k: i32) -> Option<Box<ListNode>> {
        let mut cur = head.as_mut()?;
        reverse_group(cur, k);
        while let Some(c) = get_nth_after(cur, k) {
            let _ = reverse_group(c, k);
            cur = c;
        }
        
        head
    }
}

fn reverse_group(head: &mut Box<ListNode>, k: i32) -> Option<()> {
    let k = k as usize;
    let mut cur = head;
    for i in 0..k/2 {
        if !swap_with_nth_after(cur, k - i * 2 - 1) {
            return None;
        }
        cur = cur.next.as_mut()?;
    }
    Some(())
}

fn swap_with_nth_after(node: &mut Box<ListNode>, n: usize) -> bool {
    let mut next_node = if let Some(next) = mem::take(&mut node.next) {
        next
    } else {
        return false;
    };
    let mut after = &mut next_node;

    for i in 1..n {
        if let Some(next) = &mut after.next {
            after = next;
        } else {
            node.next = Some(next_node);
            return false;
        }
    }

    let mut after_next = mem::take(&mut after.next);
    mem::swap(after, node);
    after.next = after_next;
    node.next = Some(next_node);

    true
}

fn get_nth_after(node: &mut Box<ListNode>, n: i32) -> Option<&mut Box<ListNode>> {
    let mut cur = node;
    for i in 0..n {
        cur = cur.next.as_mut()?;
    }

    Some(cur)
}
