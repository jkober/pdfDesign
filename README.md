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

Please provide a version constraint for the jkober/design requirement: dev-master


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
         
