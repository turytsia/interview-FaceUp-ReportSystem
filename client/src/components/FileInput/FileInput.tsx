import React from 'react'

type Props = {
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

const FileInput = ({ onChange }: Props) => {
  return (
    <input
        style={{ display: "none" }}
        type="file"
        hidden
        onChange={onChange}
        name="[licenseFile]"
    />
  )
}

export default FileInput