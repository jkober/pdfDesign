pdfDesign
=========
Orientado a diseñar reportes de forma dinamica, mediante una interface web realizada en Extjs y Jquery.
luego para generar los pdf utiliza fpdf y en los graficos jpgraph

http://jpgraph.net/

http://fpdf.org/

http://www.sencha.com/

http://jquery.com/



Instalacion:
============

    composer require jkober/design

Nos preguntara

    Please provide a version constraint for the jkober/design requirement: 
    debemos poner: >dev-master<


luego agregar en:
"AppKernel.php"

    ,new Design\DesignBundle\DesignBundle()

para que funcione en principio tiene que tener una conexcion a base de datos definida.

En routing.yml

    DesignBundle:
        resource: "@DesignBundle/Resources/config/routing.yml"
        prefix:   /designer

Esto puede ser cualquier cosa    
      prefix:   /designer    
      prefix:   /pdf etc.          

Para ir Finalizando:

       php app/console ca:c
       php app/console assets:install web
       o
       php app/console assets:install web --symlink
         
Ahora debemos configurar el repositorio para guardar los reportes en SqlLite:
========================================================

La carpeta data contiene "liteDbReportes.db" que es una estructura estandar para guardar los reportes y sus backup

esta capeta debemos copiarla y darle permisos para que escriba el apache lo mismo que occure con la cache de symfony 2 (setfacl)
una vez que tenemos la carpeta ubicada ( ejemplo app/data/liteDbReportes.db )

Agregamos al final del archivo

    app/config/parameters.yml
        databasePdfRep_driver: pdo_sqlite
        databasePdfRep_name: ak.db
        databasePdfRep_path: data/liteDbReportes.db
y en el archivo 

    app/config/config.yml localizamos 
    doctrine:
        dbal: 
    
y lo reemplazamos con algo como esto.

    doctrine:
        dbal:
            default_connection:   default
            connections:
                default:
                    driver:   %database_driver%
                    host:     %database_host%
                    port:     %database_port%
                    dbname:   %database_name%
                    user:     %database_user%
                    password: %database_password%
                    charset:  UTF8
                pdfReport:
                    driver:   %databasePdfRep_driver%
                    dbname:   %databasePdfRep_name%
                    charset:  UTF8
                    path:     %kernel.root_dir%/%databasePdfRep_path%
lo unico que debemos respetar es el nombre de la coneccion 

    pdfReport


    
