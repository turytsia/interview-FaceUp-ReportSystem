import { Link, Breadcrumbs as MaterialBreadcrumbs, Typography } from '@mui/material'
import React from 'react'

export type BreadcrumbItem = {
    name: string
    link?: string
}

type PropsType = {
    items: BreadcrumbItem[]
}

const BreadcrumbItemHome: BreadcrumbItem = {
    name: 'Home',
    link: '/'
}

const defaultItems: BreadcrumbItem[] = [ BreadcrumbItemHome ]

const Breadcrumbs = ({
    items
}: PropsType) => {
  return (
    <MaterialBreadcrumbs aria-label="breadcrumb">
        {[...defaultItems, ...items].map(({ name, link }) => link ? (
            <Link underline="hover" color="inherit" href={link}>
                {name}
            </Link>
        ): (
            <Typography color="text.primary">{name}</Typography>
        ))}
    </MaterialBreadcrumbs>
  )
}

export default Breadcrumbs