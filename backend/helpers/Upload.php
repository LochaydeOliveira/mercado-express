<?php

class Upload
{
    private const MAX_SIZE = 5 * 1024 * 1024;

    private const MIME = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    private const EXT = [
        'jpg',
        'jpeg',
        'png',
        'webp'
    ];

    public static function image(
        array $file,
        string $destination
    ): string {

        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception(
                'Erro no upload.'
            );
        }

        if (
            $file['size'] >
            self::MAX_SIZE
        ) {
            throw new Exception(
                'Imagem muito grande.'
            );
        }

        $mime = mime_content_type(
            $file['tmp_name']
        );

        if (
            !in_array(
                $mime,
                self::MIME
            )
        ) {
            throw new Exception(
                'Formato inválido.'
            );
        }

        $extension = strtolower(
            pathinfo(
                $file['name'],
                PATHINFO_EXTENSION
            )
        );

        if (
            !in_array(
                $extension,
                self::EXT
            )
        ) {
            throw new Exception(
                'Extensão inválida.'
            );
        }

        $filename =
            bin2hex(random_bytes(16))
            . '.'
            . $extension;

        // Normaliza as barras para o sistema operacional em uso
        $destination = rtrim(str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $destination), DIRECTORY_SEPARATOR);

        if (
            !is_dir($destination)
        ) {
            mkdir(
                $destination,
                0755,
                true
            );
        }

        if (
            !move_uploaded_file(
                $file['tmp_name'],
                $destination . DIRECTORY_SEPARATOR . $filename
            )
        ) {
            throw new Exception(
                'Falha ao mover arquivo.'
            );
        }

        return $filename;
    }
}