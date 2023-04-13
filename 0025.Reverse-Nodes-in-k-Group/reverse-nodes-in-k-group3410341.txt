// https://leetcode.com/problems/reverse-nodes-in-k-group/solutions/3410341/rust-unsafe-list-linear-time/
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

use std::ptr::{null_mut};

pub struct RawListNode {
    pub val: i32,
    pub next: *mut RawListNode
}

impl RawListNode {
    pub fn new_alloc(val: i32) -> *mut RawListNode {
        Box::into_raw(Box::new(RawListNode {
            val,
            next: null_mut()
        }))
    }

    #[inline]
    pub fn empty() -> *mut RawListNode {
        null_mut()
    }

    pub fn reverse(mut head: *mut RawListNode) -> *mut RawListNode {
        let mut tail = Self::empty();
        let mut next;
        while !head.is_null() {
            unsafe {
                // SAFETY: explicit head null check
                next = (*head).next;
                (*head).next = tail;
                tail = head;
                head = next;
            }
        }
        return tail;
    }

    pub fn to_safe_list(mut head: *mut RawListNode) -> Option<Box<ListNode>> {
        if head.is_null() {
            None
        } else {
            unsafe {
                // SAFETY: explicit head null check
                let mut list = Box::new(ListNode::new((*head).val));
                let mut l_head = &mut list;
                head = (*head).next;
                while !head.is_null() {
                    l_head = l_head.next.insert(Box::new(ListNode::new((*head).val)));
                    head = (*head).next;
                }
                Some(list)
            }
        }
    }

    pub fn drop(mut head: *mut RawListNode) {
        unsafe {
            // prevent potential stack overflow with recursive drop
            // SAFETY: explicit null checks, box drop exactly once per node
            while !head.is_null() {
                let nxt = (*head).next;
                (*head).next = null_mut();
                drop(Box::from_raw(head));
                head = nxt;
            }
        }
    }

}

pub fn reverse_n_group<'a>(mut head: &'a Option<Box<ListNode>>, mut n: i32) -> (*mut RawListNode, *mut RawListNode, &'a Option<Box<ListNode>>, i32) {
    let mut new_head = RawListNode::empty();
    let mut tail = RawListNode::empty();
    while head.is_some() && n > 0 {
        let link = RawListNode::new_alloc(head.as_ref().unwrap().val);
        if tail.is_null() {
            tail = link;
        }
        unsafe {
            // SAFETY: link is never null
            (*link).next = new_head;
        }
        new_head = link;
        head = &head.as_ref().unwrap().next;
        n -= 1;
    }
    return (new_head, tail, head, n);
}

impl Solution {
    pub fn reverse_k_group(head: Option<Box<ListNode>>, k: i32) -> Option<Box<ListNode>> {
        let mut head_ref = &head;
        let mut prev_head = RawListNode::empty();
        let mut prev_tail = RawListNode::empty();
        while head_ref.is_some() {
            let (mut new_head, new_tail, new_head_ref, n) = unsafe { reverse_n_group(head_ref, k) };
            if prev_head.is_null() {
                prev_head = new_head;
                prev_tail = new_tail;
            } else {
                if n > 0 {
                    // this means we run to the end of list before it counted n elements, thus we must not reverse it 
                    new_head = RawListNode::reverse(new_head);
                }
                unsafe {
                    // SAFETY: it's ok since prev_tail is not null when prev_head isn't
                    (*prev_tail).next = new_head;
                    prev_tail = new_tail;
                }
            }
            head_ref = new_head_ref;
        }
        let ret = RawListNode::to_safe_list(prev_head);
        // SAFETY: prev_head is a start of new list made up with RawListNode. Drops every dynamic node in the list
        // prev_tail is a pointer to some node inside the list so it doesn't need to be dropped
        RawListNode::drop(prev_head);
        return ret;
    }
}