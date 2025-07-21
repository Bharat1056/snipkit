"use client"

import { useEffect } from 'react'

export const useAestheticAnimations = () => {
  useEffect(() => {
    // Aesthetic Intersection Observer for silk-smooth scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            
            // Add the aesthetic-visible class for smooth transitions
            target.classList.add('aesthetic-visible')
            
            // Unobserve after animation starts for performance
            observer.unobserve(target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
      }
    )

    // Observe all elements with aesthetic animation classes
    const animatedElements = document.querySelectorAll('.aesthetic-up, .aesthetic-down, .aesthetic-scale')
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [])
}

export default useAestheticAnimations 